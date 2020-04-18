import { app, BrowserWindow } from "electron";

let win = null;
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1100,
    height: 600,
    frame: true,
    resizable: true,
    maximizable: true,
    backgroundColor: "#00000000",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("activate", () => {
  if (win === null) createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
