const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadFile("index.html");

  ipcMain.on("start-detection", (event, cameraData) => {
    const { videoPath, cameraId } = cameraData;

    const python = spawn("python", ["detect_violence.py", videoPath, cameraId]);

    python.stdout.on("data", (data) => {
      const msg = data.toString().trim();
      if (msg.startsWith("VIOLENCE DETECTED")) {
        const parts = msg.split(" ");
        const camId = parts[2];
        const imagePath = parts[3];
        win.webContents.send("violence-detected", { camId, imagePath });
      }
    });

    python.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
