const { app, BrowserWindow, ipcMain } = require("electron");
const { nanoid } = require("@reduxjs/toolkit");
const path = require("path");
const {
  readdirSync,
  writeFileSync,
  appendFileSync,
  readFileSync,
  statSync,
} = require("fs");
const { PythonShell } = require("python-shell");
const { DateTime } = require("luxon");
const convertHumanReadable = require("./helpers/converHumanReadable");
const { data } = require("autoprefixer");
const { exec, execSync, spawn, spawnSync } = require("child_process");
const { eventWrapper } = require("@testing-library/user-event/dist/utils");

require("electron-reload")(__dirname);
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
  },
  frame: false,
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
  mainWindow.loadURL("http://localhost:3000/");
};

app.on("ready", () => {
  createCheckWindow();
});

const createOutputWindow = () => {
  const outputWindowOptions = {
    alwaysOnTop: true,
    ...staticOptions,
  };

  outputWindow = new BrowserWindow(outputWindowOptions);
  outputWindow.loadURL("http://localhost:3000/output");
};

ipcMain.on("pin", (e, pin) => {
  if (pin === process.env["pin"]) {
    createMainWindow();
    pinWindow?.destroy();
  } else {
    pinWindow.webContents.send("pin-fail");
  }
});

const readFolders = async (basePath, folderName, fileType) => {
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
    return { status: "error", content: err };
  }
};

var globalArgs = [];

ipcMain.on("treeview-loaded", async () => {
  const basePath = path.join(process.cwd(), "python-runner");
  const algorithms = await readFolders(basePath, "algorithms", "algorithms");
  const datasets = await readFolders(basePath, "datasets", "datasets");
  const normalizations = await readFolders(
    basePath,
    "normalizations",
    "normalizations"
  );
  const data_object = [
    {
      iteratable: true,
      ...algorithms,
      label: "Algorithms",
      fileType: "algorithms",
    },
    {
      iteratable: true,
      ...datasets,
      label: "Datasets",
      fileType: "datasets",
    },
    {
      iteratable: true,
      ...normalizations,
      label: "Normalizations",
      fileType: "normalizations",
    },
  ];

  mainWindow.webContents.send("get-data", data_object);

  // if (algorithms.status !== "success" && datasets.status !== "success") {
  //   return;
  // }
  // algorithms.message = algorithms.message
  //   .filter((m) => /^algorithm/.test(m))
  //   .map((al) => {
  //     const isDisabled = disabledAlgorithms.find((d) => al.includes(d.pattern));
  //     const algoProps = { file: al, label: convertHumanReadable(al) };
  //     if (isDisabled) {
  //       algoProps.disabled = {
  //         reason: isDisabled.reason,
  //       };
  //     }
  //     return algoProps;
  //   });
  // algorithms.disabledCount = algorithms.message.filter(
  //   (al) => al.disabled
  // ).length;
  // datasets.message = datasets.message.map((ds) => {
  //   return {
  //     file: ds,
  //     label: convertHumanReadable(ds),
  //   };
  // });
  // normalizations.message = normalizations.message
  //   .filter((m) => /norm.py$/.test(m))
  //   .map((no) => {
  //     return {
  //       file: no,
  //       label: convertHumanReadable(no),
  //     };
  //   });
  // normalizations.message.unshift({
  //   file: "no",
  //   label: "none",
  // });
  // mainWindow?.webContents?.send?.("algorithms", algorithms);
  // mainWindow?.webContents?.send?.("datasets", datasets);
  // mainWindow?.webContents?.send?.("normalizations", normalizations);
});

class PythonRunner {
  shell = null;
  stopped = false;
  saveArguments(args) {
    globalArgs = args;
    try {
      writeFileSync(
        path.join(process.cwd(), "python-runner", "arguments.json"),
        JSON.stringify(args),
        {
          encoding: "utf8",
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  log(logType) {
    appendFileSync(
      path.join(process.cwd(), "python-runner", "log.txt"),
      logType + " " + DateTime.now().toString() + "\n",
      {
        encoding: "utf8",
      }
    );
  }

  sendResultToWindow() {
    try {
      let resultData = readFileSync(
        path.join(process.cwd(), "python-runner", "result.json")
      );
      !mainWindow.isDestroyed() &&
        mainWindow.webContents.send("output-result", String(resultData));
    } catch (err) {
      console.log(err);
    }
  }

  stop() {
    this.stopped = true;
    if (!this.shell?.terminated) this.shell?.kill();
  }

  runScript(scriptFile = path.join("main.py")) {
    this.stopped = false;
    let shell = new PythonShell(scriptFile, {
      scriptPath: path.join(process.cwd(), "python-runner"),
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

ipcMain.on("get-checks", () => {
  const checkScript = async (script, args = []) => {
    let { error } = await spawnSync(script, args);
    if (error) {
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
    let r = await checkScript("python");
    return r;
  };

  const checkPip = async () => {
    let r = await checkScript("pip");
    return r;
  };

  const checkPipPackages = async () => {
    let r1 = await checkScript("pip", ["show", "numpy"]);
    let r2 = await checkScript("pip", ["show", "pandas"]);
    return r1 && r2;
  };

  const checks = [];

  const checkPackage = async (label, checkFunction) => {
    const checkId = nanoid();
    const check = {
      label,
      id: checkId,
      status: "start",
    };

    checkWindow?.webContents.send("check-start", check);
    const result = await checkFunction();
    await sleep(1000);
    checkWindow?.webContents.send("check-end", {
      status: result ? "success" : "fail",
      id: checkId,
    });
    checks.push(result);
  };

  const checkPackages = async () => {
    await checkPackage("Checking Python", checkPython);
    await sleep(1000);
    await checkPackage("Checking Pip", checkPip);
    await sleep(1000);
    await checkPackage("Checking Numpy and Pandas", checkPipPackages);
    await sleep(1000);
    if (checks.every((c) => c)) {
      await sleep(300);
      createMainWindow();
      checkWindow?.close();
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
