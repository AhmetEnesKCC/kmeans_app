const { ipcRenderer, contextBridge } = require("electron");
window.ipcRenderer = ipcRenderer;
contextBridge.exposeInMainWorld("electron", () => ({
  ipcRenderer,
}));
