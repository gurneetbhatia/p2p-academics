const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

const isDev = require("electron-is-dev");

const helper = require('./helper');

// const isInitialised = helper.checkIfInitialised();

function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const extension = helper.checkIfInitialised() ? '/' : '/register';
    win.loadURL('http://localhost:3000' + extension);
    // win.loadURL(`file://${path.join(__dirname, "../public/index.html")}`);
    // win.loadFile('index.html');

    if (isDev) {
        win.webContents.openDevTools({mode: "detach"});
    }
}

ipcMain.on("register", (event, args) => {
    helper.registerUser(args);
})

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});