const path = require('path');
const fs = require('fs');

const { app, BrowserWindow } = require('electron');
const isDev = require("electron-is-dev");

function createWindow() {
    const isInitialised = checkIfInitialised();

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadURL('http://localhost:3000');
    // win.loadURL(`file://${path.join(__dirname, "../public/index.html")}`);
    // win.loadFile('index.html');

    if (isDev) {
        win.webContents.openDevTools({mode: "detach"});
    }
}

function checkIfInitialised() {
    const dir = '~/p2p/repository';

    if (fs.existsSync(dir)) {
        console.log('Initialised');
        return true;
    } else {
        console.log('Not Initialised');
        return false;
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});