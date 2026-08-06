const { app, BrowserWindow } = require("electron");
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

app.on("second-instance", () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }

        mainWindow.focus();
    }
});

function startServices() {
    // Start backend
    console.log("Starting Backend...");
    backendProcess = spawn("cmd.exe", ["/c", "npm run dev"], {
        cwd: path.join(__dirname, "../server"),
        windowsHide: false,
    });

    backendProcess.stdout?.on("data", (data) => {
        console.log("[BACKEND]", data.toString());
    });

    backendProcess.stderr?.on("data", (data) => {
        console.error("[BACKEND STDERR]", data.toString());
    });

    backendProcess.on("error", (err) => {
        console.error("[BACKEND ERROR]", err);
    });

    // Start frontend
    console.log("Starting Frontend...");
    frontendProcess = spawn("cmd.exe", ["/c", "npm run dev"], {
        cwd: path.join(__dirname, "../client"),
        windowsHide: false,
    });

    frontendProcess.stdout?.on("data", (data) => {
        console.log("[FRONTEND]", data.toString());
    });

    frontendProcess.stderr?.on("data", (data) => {
        console.error("[FRONTEND STDERR]", data.toString());
    });

    frontendProcess.on("error", (err) => {
        console.error("[FRONTEND ERROR]", err);
    });

    // Start AI service
    console.log("Starting AI Service...");
    const defaultPython = path.join(__dirname, "../ai-services/.venv/Scripts/python.exe");
    const pythonExecutable = fs.existsSync(defaultPython) ? defaultPython : "python";

    aiProcess = spawn(
        pythonExecutable,
        [
            "-m",
            "uvicorn",
            "app:app",
            "--host",
            "0.0.0.0",
            "--port",
            "8000",
        ],
        {
            cwd: path.join(__dirname, "../ai-services"),
            windowsHide: false,
        }
    );

    aiProcess.stdout?.on("data", (data) => {
        console.log("[AI]", data.toString());
    });

    aiProcess.stderr?.on("data", (data) => {
        console.error("[AI STDERR]", data.toString());
    });

    aiProcess.on("error", (err) => {
        console.error("[AI ERROR]", err);
    });
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
        });

        splash.loadFile(path.join(__dirname, "splash.html"));

        // Wait for services to be ready before loading the UI
        await waitOn({
            resources: [
                "http-get://localhost:5173",
                "http-get://localhost:5000",
                "http-get://localhost:8000/health",
            ],
            timeout: 120000,
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
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        await mainWindow.loadURL("http://localhost:5173");

        // Show the app immediately after loadURL completes.
        splash.close();
        mainWindow.show();

        // For local debugging only: keep DevTools commented out.
        // mainWindow.webContents.openDevTools();

    } catch (err) {
        // Close splash if created and exit with non-zero code to indicate startup failure.
        if (splash) splash.close();
        app.exit(1);
    }
}

app.whenReady().then(startApp);

app.on("before-quit", () => {
    // Ensure child processes are stopped when the app quits.
    try {
        backendProcess?.kill();
        frontendProcess?.kill();
        aiProcess?.kill();
    } catch (e) {
        // intentionally silent
    }
});

app.on("window-all-closed", () => {
    app.quit();
});