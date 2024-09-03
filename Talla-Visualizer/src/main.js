const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');
const util = require('util');
const os = require('os');
const createContextMenu = require('./context-menu.js');
const exec = util.promisify(require('child_process').exec);
const csvtojson = require('csvtojson');
const installExtension = require('electron-devtools-installer').default;
const { REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const { glob } = require('glob');
const { dir } = require('console');

const documentsDir = path.join(os.homedir(), 'Documents');
const workspaceDir = path.join(documentsDir, 'TallaWorkspace');
let mainWindow = null;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const isDev = process.env.NODE_ENV === 'development';

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: app.isPackaged?path.join(process.resourcesPath,"icon", 'file.ico') : path.join(app.getAppPath(),"src","icon", 'file.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    autoHideMenuBar: false,
  });
  mainWindow.setTitle('Talla');
  console.log(path.join(__dirname, 'preload.js'))
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
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval';"]
      }
    });
  });
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (!fs.existsSync(workspaceDir)) {
    fs.mkdirSync(workspaceDir, { recursive: true });
    console.log(`Directory ${workspaceDir} created.`);
  } else {
    console.log(`Directory ${workspaceDir} already exists.`);
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

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
ipcMain.handle('tree:ancors:getFilesAndFolders', () => {
  return searchWorkspaceDirectory(workspaceDir, "**/ancors/*.json");
});
ipcMain.handle('graph:getAncorsData', async (event, filePath) => {
  const dirPath = path.dirname(filePath);
  const filename= path.basename(filePath);
  const dirs = glob.sync(`${filename}`, { cwd: dirPath, root: dirPath });
  let data=[];
  if(dirs.length !== 0){
    data=JSON.parse(fs.readFileSync(filePath, 'utf8'));
    //console.log(data);
  }
  return data;
});


ipcMain.handle('graph:hyperbolas', async (event, { filePath, tdoa_obj }) => {
  const dirPath = path.dirname(filePath);
  const filename = path.basename(filePath);
  const outputName = `hyperbola${tdoa_obj.ref_id}.json`;
  const outputPath = path.join(dirPath, outputName);
  const dirs = glob.sync(`${filename}`, { cwd: dirPath, root: dirPath });

  if (dirs.length !== 0) {
    let scriptPath;
    if (app.isPackaged) {
      scriptPath = path.join(process.resourcesPath, 'scripts', 'handleHyperbolas.py');
    } else {
      scriptPath = path.join(app.getAppPath(), 'src', 'scripts', 'handleHyperbolas.py');
    }

    let command;
    const tdoa_str = JSON.stringify(tdoa_obj).replace(/"/g, '\\"');
    if (process.platform === 'win32') {
      command = `python "${scriptPath}" "${filePath}" "${outputPath}" "${tdoa_str}"`;
    } else {
      command = `python3 "${scriptPath}" "${filePath}" "${outputPath}" "${tdoa_str}"`;
    }

    console.log(`Executing command: ${command}\n`);
    
    // Wrap exec in a promise
    const execPromise = (command) => {
      return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(`Error executing script: ${error.message}`);
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
          }
          resolve(stdout);
        });
      });
    };

    try {
      const stdout = await execPromise(command);
      console.log(`stdout: ${stdout}`);

      const out = glob.sync(`${outputName}`, { cwd: dirPath, root: dirPath });
      console.log(out);
      if (out.length !== 0) {
        const data=fs.readFileSync(outputPath, 'utf8')
        return JSON.parse(data.replace(/NaN/g, "null"));
        //return JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      }
      return null;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return null;
});

ipcMain.handle('ProcessCSV', async (event, prop) => {
  const dirPath = path.dirname(prop.file);
  const dirs = glob.sync(`processed_data/${prop.fps}fps/`, { cwd: dirPath, root: dirPath });

  if (dirs.length === 0) {
    let scriptPath;
    if (app.isPackaged) {
      scriptPath = path.join(process.resourcesPath,'scripts', 'processCsvThroughFps.py');
    } else {
      scriptPath = path.join(app.getAppPath(), 'src', 'scripts', 'processCsvThroughFps.py');
    }
    let command;
    if (process.platform === 'win32') {
      command = `python "${scriptPath}" "${prop.file}" ${prop.fps}`;
    } else {
      command = `python3 "${scriptPath}" "${prop.file}" ${prop.fps}`;
    }

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

  const dirName = path.join(dirPath, "processed_data", `${prop.fps}fps`, 'index.json');
  const data = fs.readFileSync(dirName, 'utf8');
  return JSON.parse(data);
});

ipcMain.handle("AlreadyProcessed", async (event, file) => {
  const dirPath = path.join(path.dirname(file), "processed_data");
  const dirs = glob.sync(`*/`, { cwd: dirPath, root: dirPath });

  const processed = dirs.map((dir) => {
    return dir.split('fps')[0];
  });
  return processed;
});

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
    let scriptPath;
    if (app.isPackaged) {
      scriptPath = path.join(process.resourcesPath, 'scripts', 'mergeCsvAndSplit.py');
    } else {
      scriptPath = path.join(app.getAppPath(), 'src', 'scripts', 'mergeCsvAndSplit.py');
    }
    
    let command;
    if (process.platform === 'win32') {
      command = `python "${scriptPath}" --input_files "${files.join('" "')}" --base_dir "${baseDir}" --frames_per_file ${framesPerFile} --output_dir "${dirName}"`;
    } else {
      command = `python3 "${scriptPath}" --input_files "${files.join('" "')}" --base_dir "${baseDir}" --frames_per_file ${framesPerFile} --output_dir "${dirName}"`;
    }

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
  return JSON.parse(data);
});




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
    }, {});
    return groupedData;
  } catch (error) {
    console.error('Error reading and converting CSV:', error);
    throw error;
  }
});

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
      };
      campaignList.push(campaign);
    });

    result.push({
      _id: dirPath,
      name: dir,
      campaignList: campaignList,
    });

  });

  return result;
};

ipcMain.handle('get-screen-sources', async () => {
  const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
  console.log(sources);
  return sources;
});

ipcMain.handle('start-recording', async (event, sourceId) => {
  mainWindow.webContents.send('start-recording', sourceId);
});

ipcMain.handle('stop-recording', async (event) => {
  mainWindow.webContents.send('stop-recording');
});

