// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, args) => ipcRenderer.invoke(channel, args),
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, func),
  removeListener: (channel, func) => ipcRenderer.removeListener(channel, func),
  off: (channel, func) => ipcRenderer.off(channel, func),
});