// contextMenu.js

const { Menu, shell } = require('electron');

function createContextMenu(mainWindow) {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: () => {
        mainWindow.reload();
      }
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: 'CmdOrCtrl+Shift+I',
      click: () => {
        mainWindow.webContents.toggleDevTools();
      }
    },
    {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    },
    {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    },
    {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    },
    {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: () => {
        mainWindow.close();
      }
    }
  ]);

  mainWindow.webContents.on('context-menu', (event, params) => {
    contextMenu.popup({
      window: mainWindow,
      x: params.x,
      y: params.y
    });
  });
}

module.exports = createContextMenu;
