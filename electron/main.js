const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
  ipcRenderer,
  globalShortcut,
} = require("electron");
const { nanoid } = require("@reduxjs/toolkit");
const path = require("path");
const {
  readdirSync,
  writeFileSync,
  appendFileSync,
  readFileSync,
  statSync,
} = require("fs");

require("update-electron-app")();

const Store = require("electron-store");

const store = new Store();

const { PythonShell } = require("python-shell");
const { DateTime } = require("luxon");
const convertHumanReadable = require("./helpers/converHumanReadable");
const { data } = require("autoprefixer");
const { exec, execSync, spawn, spawnSync } = require("child_process");
const { eventWrapper } = require("@testing-library/user-event/dist/utils");

const pythonRunnerLocation = () => {
  return isDev
    ? join(process.cwd(), "python-runner")
    : join(app.getAppPath(), "..", "..", "python-runner");
};

const isDev = require("electron-is-dev");
const url = require("url");
const { join } = require("path");
require("dotenv").config(__dirname);

const disabledAlgorithms = [
  { pattern: "near", reason: "Euclid error" },
  { pattern: "minmax", reason: "Funcion Error" },
];

let pinWindow;
let checkWindow;
let mainWindow;
let outputWindow;

const public_path = path.resolve(__dirname, "public");

let staticOptions = {
  webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true,
    contextIsolation: false,
    devTools: isDev,
  },
  frame: false,
};

const logToMain = (logObject) => {
  mainWindow.webContents.send("log-from-main", logObject);
};

const staticFilePath = (fileName) => {
  return path.resolve(public_path, fileName);
};

const createCheckWindow = () => {
  const checkWindowOptions = {
    ...staticOptions,
    width: 400,
    height: 300,
    resizable: false,
  };
  checkWindow = new BrowserWindow(checkWindowOptions);
  checkWindow.loadURL("http://localhost:3000/check");
};

const createMainWindow = () => {
  const mainWindowOptions = {
    ...staticOptions,
  };

  mainWindow = new BrowserWindow(mainWindowOptions);
  mainWindow.loadURL(
    isDev ? "http://localhost:3000" : `file://${__dirname}/../build/index.html`
  );
  globalShortcut.register("CommandOrControl+R", () => {
    console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
};
app.on("ready", () => {
  createMainWindow();
});

const createOutputWindow = () => {
  const outputWindowOptions = {
    alwaysOnTop: true,
    ...staticOptions,
  };

  outputWindow = new BrowserWindow(outputWindowOptions);
  outputWindow.loadURL(path.join(__dirname, "build", "index.html"));
};

ipcMain.on("pin", (e, pin) => {
  if (pin === process.env["pin"]) {
    createMainWindow();
    pinWindow?.destroy();
  } else {
    pinWindow.webContents.send("pin-fail");
  }
});

const readFolders = async (basePath, folderName, fileType, preview) => {
  const folderPath = path.join(basePath, folderName);
  const folderContent = [];
  try {
    const content = await readdirSync(folderPath);
    content.forEach(async (co) => {
      if (co === "__pycache__") {
        return;
      }
      const contentPath = path.join(folderPath, co);
      const contentStat = statSync(contentPath);
      if (contentStat.isDirectory()) {
        const subDirContent = await readFolders(folderPath, co, fileType);
        folderContent.push({
          label: co,
          name: co,
          path: contentPath,
          type: "folder",
          iteratable: true,
          fileType,
          ...subDirContent,
        });
      } else {
        const ext = co.match(/\.[0-9a-z]+$/i)[0].replace(".", "");
        folderContent.push({
          label: convertHumanReadable(co) + "." + ext,
          labelWOExt: convertHumanReadable(co),
          name: co,
          path: contentPath,
          folder: folderName,
          iteratable: false,
          type: "file",
          preview: true,
          fileType,
          ext,
        });
      }
    });
    return {
      status: "success",
      content: folderContent,
    };
  } catch (err) {
    logToMain(err);
    return { status: "error", content: err };
  }
};

var globalArgs = [];

ipcMain.on("read-file", async (e, path) => {
  try {
    const fileData = readFileSync(path);
    mainWindow.webContents.send("file-data", fileData.toString().trim());
  } catch (err) {
    console.log(err);
  }
});

ipcMain.on("read-files", async () => {
  const basePath = pythonRunnerLocation();
  const app_settings = store.get("app-settings");
  const algorithms = await readFolders(app_settings.algo, "", "algo", true);
  const datasets = await readFolders(app_settings.data, "", "data", false);
  const normalizations = await readFolders(app_settings.norm, "", "norm", true);
  const data_object = [
    {
      iteratable: true,
      ...algorithms,
      label: "Algorithms",
      fileType: "algo",
    },
    {
      iteratable: true,
      ...datasets,
      label: "Datasets",
      fileType: "data",
    },
    {
      iteratable: true,
      ...normalizations,
      label: "Normalizations",
      fileType: "norm",
    },
  ];
  logToMain(data_object);

  mainWindow.webContents.send("get-data", data_object);
});

class PythonRunner {
  shell = null;
  stopped = false;
  saveArguments(args) {
    const loop = store.get("app-settings.loop");
    args.loop = loop ?? args.loop;
    globalArgs = args;
    try {
      writeFileSync(
        path.join(pythonRunnerLocation(), "arguments.json"),
        JSON.stringify(args),
        {
          encoding: "utf8",
        }
      );
    } catch (err) {
      logToMain(err);
      console.log(err);
    }
  }

  log(logType) {
    appendFileSync(
      path.join(pythonRunnerLocation(), "log.txt"),
      logType + " " + DateTime.now().toString() + "\n",
      {
        encoding: "utf8",
      }
    );
  }

  sendResultToWindow() {
    try {
      let resultData = readFileSync(
        path.join(pythonRunnerLocation(), "result.json")
      );
      !mainWindow.isDestroyed() &&
        mainWindow.webContents.send("output-result", String(resultData));
    } catch (err) {
      logToMain(err);
      console.log(err);
    }
  }

  stop() {
    this.stopped = true;
    if (!this.shell?.terminated) this.shell?.kill();
  }

  runScript(scriptFile = "main.py") {
    this.stopped = false;
    let shell = new PythonShell(scriptFile, {
      scriptPath: pythonRunnerLocation(),
      args: [globalArgs.datasets, globalArgs.algorithms],
    });
    this.shell = shell;

    !mainWindow.isDestroyed() &&
      !this.stopped &&
      mainWindow.webContents.send("output-start");
    shell.on("message", (mp) => {
      !mainWindow.isDestroyed() &&
        !this.stopped &&
        mainWindow.webContents.send("output-message-print", mp);
    });

    shell.on("pythonError", (e) => {
      this.log("python error");
      !mainWindow.isDestroyed() &&
        !this.stopped &&
        mainWindow.webContents.send("output-error", e.message);
    });
    shell.on("close", (e) => {
      !mainWindow.isDestroyed() &&
        !this.stopped &&
        mainWindow.webContents.send("output-close");
      this.log("close");
      this.sendResultToWindow();
    });
  }
}

const runner = new PythonRunner();

mainWindow?.on("close", () => {
  runner?.stop();
});

ipcMain.on("run", (e, args) => {
  runner.saveArguments(args);
  runner.runScript();
});

ipcMain.on("re-run", (e) => {
  !mainWindow.isDestroyed() && outputWindow.webContents.send("reset");
  runner.runScript();
});

ipcMain.on("stop-code", () => {
  runner.stop();
});

ipcMain.on("output-window-loaded", () => {
  !outputWindow.isDestroyed() &&
    outputWindow.webContents.send("arguments", globalArgs);
  runner.runScript();
});

/* Check Window */

let stopCheck = false;

ipcMain.on("check:abort", () => {
  stopCheck = true;
});

ipcMain.on("get-checks", () => {
  stopCheck = false;

  const checkScript = async (script, args = []) => {
    let { error } = await spawnSync(
      script === "python3" && process.platform === "win32" ? "python" : script,
      args
    );
    if (error) {
      logToMain(error);
      console.log(error);
      return false;
    } else {
      return true;
    }
  };

  const sleep = (ms) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });

  const checkPython = async () => {
    let r1 = await checkScript("python");
    let r2 = await checkScript("python3");
    return r1 || r2;
  };

  const checkPip = async () => {
    let r1 = await checkScript("pip");
    let r2 = await checkScript("pip3");
    return r1 || r2;
  };

  const checkPipPackages = async () => {
    let r11 = await checkScript("python", ["-c", '"import numpy"']);
    let r12 = await checkScript("python3", ["-c", '"import numpy"']);
    let r21 = await checkScript("python", ["-c", '"import pandas"']);
    let r22 = await checkScript("python3", ["-c", '"import pandas"']);

    return (r11 || r12) && (r21 || r22);
  };

  const checkSKLearn = async () => {
    let r1 = await checkScript("python", ["-c", '"import sklearn"']);
    let r2 = await checkScript("python3", ["-c", '"import sklearn"']);
    return r1 || r2;
  };

  var checks = [];

  const checkPackage = async (label, checkFunction) => {
    const checkId = nanoid();
    const check = {
      label,
      id: checkId,
      status: "start",
    };

    !stopCheck && mainWindow?.webContents.send("check-start", check);
    const result = await checkFunction();
    await sleep(1000);
    !stopCheck &&
      mainWindow?.webContents.send("check-end", {
        status: result ? "success" : "fail",
        id: checkId,
      });
    checks.push(result);
  };

  const checkPackages = async () => {
    await checkPackage("Python", checkPython);
    await sleep(1000);
    await checkPackage("Pip", checkPip);
    await sleep(1000);
    await checkPackage("Numpy and Pandas", checkPipPackages);
    await sleep(1000);
    await checkPackage("Sklearn", checkSKLearn);
    await sleep(1000);
    if (checks.every((c) => c)) {
      mainWindow.send("check-success");
    } else {
      mainWindow.send("check-fail");
    }
  };

  checkPackages();
});

/* APP CONTROLS */

ipcMain.on("app-control:close", () => {
  app.quit();
});

ipcMain.on("app-control:maximize", (e) => {
  const windowID = e.sender.id;
  const window = BrowserWindow.getAllWindows().find((w) => w.id === windowID);
  window.isMaximized() ? window.unmaximize() : window.maximize();
});

ipcMain.on("app-control:minimize", (e) => {
  const windowID = e.sender.id;
  const window = BrowserWindow.getAllWindows().find((w) => w.id === windowID);
  window.minimize();
});

ipcMain.on("menu:github", () => {
  shell.openExternal("https://github.com/AhmetEnesKCC/kmeans_app");
});

ipcMain.on("open:dialog:folder", (e, inputName) => {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    })
    .then((res) => {
      if (res.canceled) {
        return;
      }
      mainWindow.webContents.send("folder:path", {
        result: res.filePaths[0],
        inputName,
      });
    });
});

ipcMain.on("get-app-settings", () => {
  const settings = store.get("app-settings");
  mainWindow.webContents.send("settings-send", settings);
});

ipcMain.on("save-storage", (e, { key, value }) => {
  console.log(key);
  store.set(key, value);
});
