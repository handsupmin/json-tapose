import { app, BrowserWindow, shell } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const appUrl = process.env.VITE_DEV_SERVER_URL;

app.commandLine.appendSwitch("password-store", "basic");
app.commandLine.appendSwitch("use-mock-keychain");

const createMainWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
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

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    const currentUrl = mainWindow.webContents.getURL();
    if (url === currentUrl) {
      return;
    }

    event.preventDefault();
    void shell.openExternal(url);
  });

  if (appUrl) {
    void mainWindow.loadURL(appUrl);
  } else {
    void mainWindow.loadFile(join(currentDir, "../dist-desktop/index.html"));
  }

  return mainWindow;
};

void app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
