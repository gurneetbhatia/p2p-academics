const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require("electron-is-dev");
const { MongoClient } = require('mongodb');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const fs = require('fs');
const io = require("socket.io")();
const socketClient = require("socket.io-client");
const helper = require('./helper');

let socketServers = []

let socketServerUID;

async function initialiseServer() {
    await helper.connectToMongo();
    socketServerUID = helper.generateServerUID();
    helper.reserveServerUID(socketServerUID);
    io.attach(8080, {
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false,
        path: '/socket.io/sockets/' + socketServerUID
    });

    io.on('connection', (socket) => {
        console.log("client connection detected");
        console.log(socket);
    });

    /**
     * Note to self: Upon starting the application, also update the database
     * to correctly reflect the resources available on this device for the network.
     */
    helper.updateResourcesList(socketServerUID);

    // io.on('update-resource-list', (socket) => {
    //     /**
    //      * Call the helper function to fetch details of all available resources
    //      * from the repository
    //      * Then update the database with these
    //      */
    //     helper.updateResourceList();
    // })

    // now connect to all other active servers
    activeServers = helper.fetchActiveServers();
    activeServers.toArray((err, documents) => {
        if (err) throw err;
        documents.forEach(element => {
            if (element.serverUID != socketServerUID) {
                const newSocket = socketClient("http://localhost:8000", {
                    reconnectionDelayMax: 10000,
                    path: '/socket.io/sockets/' + element.serverUID
                });
                console.log("Connected to " + element.serverUID);
                socketServers.push(newSocket);
            }
        });
    })
    console.log(activeServers);
    console.log(activeServers.array);
}
initialiseServer();

const baseUrl = 'http://localhost:3000';

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
    console.log("GETTING REPO RESOURCES [MAIN]");
    event.reply("return-repo-resources", helper.getRepositoryResources());
    // event.reply("return-repo-resources", "test response");
    //win.webContents.send("return-repo-resources", helper.getRepositoryResources());
});

ipcMain.on("upload-files-click", (event, args) => {
    console.log("Upload files clicked [MAIN]");
    helper.handleUploadFilesClick();
});

ipcMain.on("delete-resource", (event, args) => {
    console.log("Deleting resource [MAIN]");
    console.log(args);
    helper.deleteResource(args);
});

ipcMain.on("update-resource", (event, args) => {
    helper.updateResource(args);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    console.log("CLOSING APPLICATION [MAIN]");
    helper.closeApplication(socketServerUID);

    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// helper.getRepositoryResources();