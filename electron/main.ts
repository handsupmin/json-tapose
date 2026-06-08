import {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  shell,
  Tray,
  type MenuItemConstructorOptions,
  type NativeImage,
} from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const appUrl = process.env.VITE_DEV_SERVER_URL;
const appName = "JSONtapose";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

app.commandLine.appendSwitch("password-store", "basic");
app.commandLine.appendSwitch("use-mock-keychain");

const getDesktopAssetPath = (fileName: string): string => {
  const assetRoot = appUrl ? "public/favicon" : "dist-desktop/favicon";
  return join(app.getAppPath(), assetRoot, fileName);
};

const createTrayIcon = (): NativeImage => {
  const iconFile =
    process.platform === "win32" ? "favicon.ico" : "favicon-96x96.png";
  const fallbackIcon = getDesktopAssetPath("favicon.ico");
  const icon = nativeImage.createFromPath(getDesktopAssetPath(iconFile));
  const trayIcon = icon.isEmpty()
    ? nativeImage.createFromPath(fallbackIcon)
    : icon;

  if (trayIcon.isEmpty()) {
    throw new Error("Tray icon asset could not be loaded");
  }

  const resizedIcon = trayIcon.resize({ width: 16, height: 16 });

  if (process.platform === "darwin") {
    resizedIcon.setTemplateImage(true);
  }

  return resizedIcon;
};

const createMainWindow = (): BrowserWindow => {
  const window = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 960,
    minHeight: 700,
    title: "JSONtapose",
    backgroundColor: "#f7f2fb",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(currentDir, "preload.js"),
      sandbox: true,
    },
  });

  window.on("close", (event) => {
    if (isQuitting) {
      return;
    }

    event.preventDefault();
    window.hide();
    updateTrayMenu();
  });

  window.on("minimize", () => {
    if (process.platform !== "win32") {
      return;
    }

    window.hide();
    updateTrayMenu();
  });

  window.on("show", updateTrayMenu);
  window.on("hide", updateTrayMenu);
  window.on("closed", () => {
    if (mainWindow === window) {
      mainWindow = null;
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  window.webContents.on("will-navigate", (event, url) => {
    const currentUrl = window.webContents.getURL();
    if (url === currentUrl) {
      return;
    }

    event.preventDefault();
    void shell.openExternal(url);
  });

  if (appUrl) {
    void window.loadURL(appUrl);
  } else {
    void window.loadFile(join(currentDir, "../dist-desktop/index.html"));
  }

  return window;
};

const showMainWindow = (): void => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    mainWindow = createMainWindow();
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();
  updateTrayMenu();
};

const hideMainWindow = (): void => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  mainWindow.hide();
  updateTrayMenu();
};

const toggleMainWindow = (): void => {
  if (mainWindow?.isVisible()) {
    hideMainWindow();
    return;
  }

  showMainWindow();
};

const quitApp = (): void => {
  isQuitting = true;
  tray?.destroy();
  tray = null;
  app.quit();
};

const buildTrayMenu = (): Menu => {
  const isWindowVisible = Boolean(mainWindow?.isVisible());
  const menuTemplate: readonly MenuItemConstructorOptions[] = [
    {
      label: isWindowVisible ? `Hide ${appName}` : `Open ${appName}`,
      click: () => {
        if (isWindowVisible) {
          hideMainWindow();
          return;
        }

        showMainWindow();
      },
    },
    { type: "separator" },
    {
      label: `Quit ${appName}`,
      click: quitApp,
    },
  ];

  return Menu.buildFromTemplate([...menuTemplate]);
};

function updateTrayMenu(): void {
  if (!tray) {
    return;
  }

  if (process.platform === "darwin") {
    tray.setContextMenu(null);
    return;
  }

  tray.setContextMenu(buildTrayMenu());
}

const createTray = (): void => {
  if (tray) {
    return;
  }

  tray = new Tray(createTrayIcon());
  tray.setToolTip(appName);
  tray.on("click", toggleMainWindow);
  tray.on("double-click", showMainWindow);
  tray.on("right-click", () => {
    tray?.popUpContextMenu(buildTrayMenu());
  });
  updateTrayMenu();
};

void app.whenReady().then(() => {
  createTray();
  showMainWindow();

  app.on("activate", () => {
    showMainWindow();
  });
});

app.on("before-quit", () => {
  isQuitting = true;
});

app.on("window-all-closed", () => {
  if (isQuitting) {
    app.quit();
  }
});
