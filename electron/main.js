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

    console.log("Starting Backend...");

    backendProcess = spawn("cmd.exe", ["/c", "npm run dev"], {
        cwd: path.join(__dirname, "../server"),
        windowsHide: false,
    });

    backendProcess.stdout.on("data", (data) => {
        console.log("[BACKEND]", data.toString());
    });

    backendProcess.stderr.on("data", (data) => {
        console.error("[BACKEND ERROR]", data.toString());
    });

    backendProcess.on("close", (code) => {
        console.log("[BACKEND CLOSED]", code);
    });
    backendProcess.on("exit", (code) => {
    console.log("[BACKEND EXIT]", code);
});

backendProcess.on("error", (err) => {
    console.error("[BACKEND ERROR]", err);
});

    console.log("Starting Frontend...");

    frontendProcess = spawn("cmd.exe", ["/c", "npm run dev"], {
        cwd: path.join(__dirname, "../client"),
        windowsHide: false,
    });

    frontendProcess.stdout.on("data", (data) => {
        console.log("[FRONTEND]", data.toString());
    });

    frontendProcess.stderr.on("data", (data) => {
        console.error("[FRONTEND ERROR]", data.toString());
    });

    console.log("Starting AI...");

    const defaultPython = path.join(__dirname, "../ai-services/.venv/Scripts/python.exe");
    const pythonExecutable = fs.existsSync(defaultPython) ? defaultPython : "python";
    if (pythonExecutable === "python") {
        console.warn("AI service virtual environment not found; falling back to system python. Ensure the correct interpreter is available.");
    }

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

    aiProcess.stdout.on("data", (data) => {
        console.log("[AI]", data.toString());
    });

    aiProcess.stderr.on("data", (data) => {
        console.error("[AI ERROR]", data.toString());
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

        console.log("Waiting for services...");

        await waitOn({
            resources: [
                "http-get://localhost:5173",
                "http-get://localhost:5000",
                "http-get://localhost:8000/health",
            ],
            timeout: 120000,
        });

        console.log("Services Ready.");

        console.log("Creating main window...");

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

        console.log("Main window created.");

        await mainWindow.loadURL("http://localhost:5173");

        console.log("URL loaded.");

        // Show the app immediately after loadURL completes.
        splash.close();
        mainWindow.show();

        // Uncomment for debugging if needed:
        // mainWindow.webContents.openDevTools();

    } catch (err) {

        console.error("Electron Startup Error:");
        console.error(err);

        if (splash) splash.close();

    }
}

app.whenReady().then(startApp);

app.on("before-quit", () => {

    console.log("Stopping services...");

    backendProcess?.kill();
    frontendProcess?.kill();
    aiProcess?.kill();

});

app.on("window-all-closed", () => {
    app.quit();
});