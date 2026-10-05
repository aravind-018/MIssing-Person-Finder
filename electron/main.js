const { app, BrowserWindow, dialog } = require("electron");
const { spawn } = require("child_process");
const fs = require("fs");
const waitOn = require("wait-on");
const path = require("path");

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
    process.exit(0);
}

let splash;
let mainWindow;

let backendProcess;
let frontendProcess;
let aiProcess;

const isPackaged = app.isPackaged;
const baseDir = isPackaged ? process.resourcesPath : path.join(__dirname, "..");
const logFilePath = path.join(app.getPath("userData"), "godseye-desktop.log");

function logMessage(prefix, message) {
    const entry = `[${new Date().toISOString()}] [${prefix}] ${message}\n`;
    try {
        fs.appendFileSync(logFilePath, entry);
    } catch (e) {}
    console.log(`[${prefix}] ${message}`);
}

function startServices() {
    logMessage("SYSTEM", `Starting GodsEye (isPackaged=${isPackaged}). Base directory: ${baseDir}`);

    const serverDir = path.join(baseDir, "server");
    const aiDir = path.join(baseDir, "ai-services");
    const clientDir = path.join(baseDir, "client");

    // 1. Start Backend Process
    if (isPackaged) {
        logMessage("BACKEND", `Spawning Node backend from ${serverDir}`);
        const serverApp = path.join(serverDir, "app.js");
        backendProcess = spawn(process.execPath, [serverApp], {
            cwd: serverDir,
            env: { ...process.env, ELECTRON_RUN_AS_NODE: "1", NODE_ENV: "production" },
            windowsHide: true,
        });
    } else {
        logMessage("BACKEND", `Spawning dev backend from ${serverDir}`);
        backendProcess = spawn("cmd.exe", ["/c", "npm run dev"], {
            cwd: serverDir,
            windowsHide: false,
        });
    }

    backendProcess.stdout?.on("data", (data) => logMessage("BACKEND", data.toString().trim()));
    backendProcess.stderr?.on("data", (data) => logMessage("BACKEND ERR", data.toString().trim()));
    backendProcess.on("error", (err) => logMessage("BACKEND ERR", err.message || String(err)));

    // 2. Start Frontend Process (only in dev mode; in packaged mode Express serves client/dist)
    if (!isPackaged) {
        logMessage("FRONTEND", `Spawning Vite dev frontend from ${clientDir}`);
        frontendProcess = spawn("cmd.exe", ["/c", "npm run dev"], {
            cwd: clientDir,
            windowsHide: false,
        });
        frontendProcess.stdout?.on("data", (data) => logMessage("FRONTEND", data.toString().trim()));
        frontendProcess.stderr?.on("data", (data) => logMessage("FRONTEND ERR", data.toString().trim()));
        frontendProcess.on("error", (err) => logMessage("FRONTEND ERR", err.message || String(err)));
    }

    // 3. Start AI Service Process
    const venvPython = path.join(aiDir, ".venv", "Scripts", "python.exe");
    const pythonExec = fs.existsSync(venvPython) ? venvPython : "python";
    logMessage("AI", `Spawning AI service using ${pythonExec} from ${aiDir}`);

    aiProcess = spawn(
        pythonExec,
        ["-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"],
        {
            cwd: aiDir,
            windowsHide: true,
        }
    );

    aiProcess.stdout?.on("data", (data) => logMessage("AI", data.toString().trim()));
    aiProcess.stderr?.on("data", (data) => logMessage("AI ERR", data.toString().trim()));
    aiProcess.on("error", (err) => logMessage("AI ERR", err.message || String(err)));
}

async function startApp() {
    try {
        startServices();

        splash = new BrowserWindow({
            width: 650,
            height: 420,
            frame: false,
            resizable: false,
            alwaysOnTop: true,
            autoHideMenuBar: true,
            backgroundColor: "#020617",
            icon: path.join(__dirname, "icon.png"),
        });

        splash.loadFile(path.join(__dirname, "splash.html"));

        const targetUrl = isPackaged ? "http://localhost:5000" : "http://localhost:5173";
        const resourcesToWait = isPackaged
            ? ["http-get://localhost:5000/health", "http-get://localhost:8000/health"]
            : ["http-get://localhost:5173", "http-get://localhost:5000/health", "http-get://localhost:8000/health"];

        logMessage("SYSTEM", `Waiting for resources: ${resourcesToWait.join(", ")}`);

        await waitOn({
            resources: resourcesToWait,
            timeout: 120000,
            interval: 500,
        });

        mainWindow = new BrowserWindow({
            width: 1450,
            height: 900,
            minWidth: 1200,
            minHeight: 700,
            show: false,
            autoHideMenuBar: true,
            title: "GodsEye",
            backgroundColor: "#0f172a",
            icon: path.join(__dirname, "icon.png"),
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        await mainWindow.loadURL(targetUrl);

        if (splash && !splash.isDestroyed()) splash.close();
        mainWindow.show();
    } catch (err) {
        logMessage("SYSTEM ERR", `Startup failed: ${err.stack || err.message || String(err)}`);
        if (splash && !splash.isDestroyed()) splash.close();
        dialog.showErrorBox(
            "GodsEye Startup Error",
            `Failed to start GodsEye background services.\n\nError: ${err.message || String(err)}\n\nCheck logs at: ${logFilePath}`
        );
        app.exit(1);
    }
}

app.on("second-instance", () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

app.whenReady().then(startApp);

function stopChildProcesses() {
    try {
        if (backendProcess && !backendProcess.killed) backendProcess.kill();
        if (frontendProcess && !frontendProcess.killed) frontendProcess.kill();
        if (aiProcess && !aiProcess.killed) aiProcess.kill();
    } catch (e) {
        // silent cleanup
    }
}

app.on("before-quit", stopChildProcesses);
app.on("will-quit", stopChildProcesses);

app.on("window-all-closed", () => {
    stopChildProcesses();
    app.quit();
});