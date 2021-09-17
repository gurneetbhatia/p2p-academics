const path = require('path');
const { app, BrowserWindow } = require('electron');
const isDev = require("electron-is-dev");
const { MongoClient } = require('mongodb');

const dbUri = "mongodb+srv://dbUser:dbUserPassword@third-year-project.elclq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect(err => {
    const collection = client.db("test").collection("devices");
    client.close();
    console.log(collection);
})

function createWindow() {
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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});