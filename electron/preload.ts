import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("jsonTaposeDesktop", {
  platform: process.platform,
});
