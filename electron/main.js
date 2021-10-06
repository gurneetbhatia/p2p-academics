const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require("electron-is-dev");
const { MongoClient } = require('mongodb');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const fs = require('fs');

const helper = require('./helper');

// const isInitialised = helper.checkIfInitialised();
const baseUrl = 'http://localhost:3000';

const dbUri = "mongodb+srv://dbUser:dbUserPassword@third-year-project.elclq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     client.close();
//     console.log(collection);
// })
let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const extension = helper.checkIfInitialised() ? '/' : '/register';
    win.loadURL(baseUrl + extension);
    // win.loadURL(`file://${path.join(__dirname, "../public/index.html")}`);
    // win.loadFile('index.html');

    if (isDev) {
        win.webContents.openDevTools({mode: "detach"});
    }
}

function registerUser(data) {
    let content = JSON.stringify({
        name: data.name,
        email: data.email,
        knowledgeDomains: []
    });
    const filepath = './user/meta.txt';
    mkdirp(getDirName(filepath), (err) => {
        console.log(err);
    })
    fs.writeFile(filepath, content, (err) => {
        mkdirp(getDirName(filepath), (err) => {
            console.log(err);
        });

        fs.writeFileSync(filepath, content);
    });
    console.log("User file saved locally");
    win.loadURL(baseUrl + '/');
}

ipcMain.on("register", (event, args) => {
    registerUser(args);
});

ipcMain.on("navigate-to", (path) => {
    win.loadUrl(baseUrl + path);
});

ipcMain.on("get-repo-resources", (event, args) => {
    // event.reply("return-repo-resources", "test response");
    win.webContents.send("return-repo-resources", helper.getRepositoryResources());
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

// helper.getRepositoryResources();