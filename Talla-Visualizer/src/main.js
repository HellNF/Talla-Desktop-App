const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const util = require('node:util');
const os = require('node:os');
const createContextMenu = require('./context-menu.js');
const exec = util.promisify(require('child_process').exec);
const csvtojson = require('csvtojson');
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
      preload: path.join(app.getAppPath(), 'src', 'preload.js'),
      nodeIntegration: false,
      sandbox: false,
    },
    autoHideMenuBar: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  createContextMenu(mainWindow);
  if (isDev) {
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
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
app.whenReady().then(() => {
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

ipcMain.handle('tree:CSV:getFilesAndFolders', () => {
  return searchWorkspaceDirectory(workspaceDir, "**/traces.csv");
});

ipcMain.handle('tree:element:getFilesAndFolders', () => {
  return searchWorkspaceDirectory(workspaceDir, "**/elements/*.json");
});

// Processing dei dati
ipcMain.handle('ProcessCSV', async (event, prop) => {
  const dirPath = path.dirname(prop.file);
  const dirs = glob.sync(`processed_data/${prop.fps}fps/`, { cwd: dirPath, root: dirPath });

  if (dirs.length === 0) {
    const scriptPath = path.join(app.getAppPath(), 'src', 'scripts', 'processCsvThroughFps.py');
    const command = `python "${scriptPath}" "${prop.file}" ${prop.fps}`;

    try {
      const { stdout, stderr } = await exec(command);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
    } catch (error) {
      console.error(`Error executing script: ${error.message}`);
      throw error; // Rilancia l'errore per gestirlo nel contesto del chiamante
    }
  }

  const dirName = path.join(dirPath, "processed_data", `${prop.fps}fps`, 'index.json');
  const data = fs.readFileSync(dirName, 'utf8');
  return JSON.parse(data);
});
ipcMain.handle("AlreadyProcessed", async (event, file) => {
  
  const dirPath =  path.join(path.dirname(file), "processed_data");
  const dirs = glob.sync(`*/`, { cwd: dirPath, root: dirPath });
  
  const processed = dirs.map((dir) => {
     return dir.split('fps')[0];
  })
  return processed;
})
ipcMain.handle('LoadCSV', async (event, prop) => {
  const dirPath = path.dirname(prop.file);
  let dirName = prop.files.join('_');
  
  const alreadyDone = glob.sync(`processed_data/${prop.fps}fps/${dirName}/`, { cwd: dirPath, root: dirPath });
  console.log(alreadyDone);

  if (alreadyDone.length === 0) {
    const dirs = glob.sync(`processed_data/${prop.fps}fps/*.csv`, { cwd: dirPath, root: dirPath });
    const files = [];
    prop.files.forEach(file => {
      for (const dir of dirs) {
        if (dir.includes(file)) {
          files.push(path.join(dirPath, dir));
          break;
        }
      }
    });

    const framesPerFile = prop.fps == 5 ? 2000 : prop.fps == 10 ? 1000 : 500;
    const baseDir = path.join(dirPath, "processed_data", `${prop.fps}fps`);
    const command = `python "${path.join(app.getAppPath(), 'src', 'scripts', 'mergeCsvAndSplit.py')}" --input_files "${files.join('" "')}" --base_dir "${baseDir}" --frames_per_file ${framesPerFile} --output_dir "${dirName}"`;

    try {
      const { stdout, stderr } = await exec(command);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
    } catch (error) {
      console.error(`Error executing script: ${error.message}`);
      throw error;
    }
  }

  const indexFile = path.join(dirPath, "processed_data", `${prop.fps}fps`, dirName, 'index.json');
  
  const data = fs.readFileSync(indexFile, 'utf8');
  // console.log(data);
  return JSON.parse(data);
  
});
// Handler per leggere il file CSV e convertirlo in JSON
ipcMain.handle('LoadCSV:readFile', async (event, file) => {
  try {
    const csvFilePath = path.resolve(file);
    const jsonArray = await csvtojson().fromFile(csvFilePath);
    const groupedData = jsonArray.reduce((acc, obj) => {
      const frame = obj.frame;
      if (!acc[frame]) {
        acc[frame] = [];
      }
      acc[frame].push(obj);
      return acc;
    },{});
    return groupedData;
  } catch (error) {
    console.error('Error reading and converting CSV:', error);
    throw error;
  }
});
// Ottenimento degli Elementi ambientali per il grafico
ipcMain.handle('graph:getElementsData', (event, filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  const jsData = JSON.parse(data);
  return transformObjectToEnvObject(jsData);
});

function transformObjectToEnvObject(original) {
  const transformedObjects = [];

  for (const [label, properties] of Object.entries(original)) {
    const transformedObject = {
      label: label,
      shape: properties.shape,
      coordinates: properties.vertex ? properties.vertex.map(v => ({ x: v[0], y: v[1] })) : [],
      style: properties.style ? Object.entries(properties.style).map(([key, value]) => ({ key, value })) : [],
    };

    if (properties.shape === 'circle') {
      transformedObject.radius = properties.radius;
      transformedObject.centre = { x: properties.center[0], y: properties.center[1] };
    }

    transformedObjects.push(transformedObject);
  }

  return transformedObjects;
}

const searchWorkspaceDirectory = (workspaceDir, pattern) => {
  const result = [];
  const directories = fs.readdirSync(workspaceDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  directories.forEach(dir => {
    const dirPath = path.join(workspaceDir, dir);
    const files = glob.sync(pattern, { cwd: dirPath, nodir: true });
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
      _id: dirPath,
      name: dir,
      campaignList: campaignList,
    })

  });

  return result;
};
