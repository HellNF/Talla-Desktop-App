const { app, BrowserWindow,session, ipcMain  } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os=require('node:os');

const installExtension = require('electron-devtools-installer').default;
const { REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const { glob } = require('glob');

// Definisci il percorso della directory di lavoro
const documentsDir = path.join(os.homedir(), 'Documents');
const workspaceDir = path.join(documentsDir, 'TallaWorkspace');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
const isDev = process.env.NODE_ENV === 'development';
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(),'src', 'preload.js'),
      nodeIntegration: false,
      
    },
    autoHideMenuBar: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (isDev) {
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
          ],
        },
      });
    });
  }
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// In production, load the react devtools extension

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then( () => {

  installExtension(REACT_DEVELOPER_TOOLS)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));

  // Crea la directory di lavoro se non esiste
  if (!fs.existsSync(workspaceDir)) {
    fs.mkdirSync(workspaceDir, { recursive: true });
    console.log(`Directory ${workspaceDir} created.`);
  } else {
    console.log(`Directory ${workspaceDir} already exists.`);
  }

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('tree:getFilesAndFolders', () => {
  
  return searchWorkspaceDirectory(workspaceDir);
});

const searchWorkspaceDirectory = (workspaceDir) => {
  const result = [];
  const directories = fs.readdirSync(workspaceDir, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name);
  
  directories.forEach(dir => {
    const dirPath = path.join(workspaceDir, dir);
    const files = glob.sync('**/traces.csv', { cwd: dirPath, nodir: true });
    const campaignList = [];
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const campaign = {
        id: filePath,
        name: file,
    }
    campaignList.push(campaign);
    })

    result.push({
      _id:dirPath,
      name: dir,
      campaignList: campaignList,
    })
    
  });

  return result;
};

