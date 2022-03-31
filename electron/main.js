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
const PDFWindow = require('electron-pdf-window');
const socketStream = require("socket.io-stream");

let socketServers = []

let socketServerUID;

async function initialiseServer() {
    await helper.connectToMongo();
    socketServerUID = helper.generateServerUID();
    helper.reserveServerUID(socketServerUID);
    helper.setupEncryption(socketServerUID);
    io.attach(8080, {
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false,
        path: '/socket.io/sockets/' + socketServerUID
    });

    io.on('connection', (socket) => {
        console.log("client connection detected");
        socket.on("request-resource", (args, callback) => {
            console.log("resource request detected [SOCKET]");
            console.log(args);
            const fileBuffer = helper.getFileBuffer(args.fileid);
            const output = fileBuffer ? {status: 'ok', buffer: fileBuffer} : {status: 'fail', fileBuffer: null}
            callback(output);
        });

        socket.on("request-user-profile", (args, callback) => {
            console.log("user profile request detected [SOCKET");
            const profile = helper.getUserProfile();
            callback(helper.encryptData({
                status: 'ok',
                profile: profile
            }, args.publicKey));
        })
    });
    helper.updateResourcesList(socketServerUID);
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
    const filepath = './user/meta.json';
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

async function requestUserProfiles(event, documents) {
    for(doc of documents) {
        requestSpecificUserProfile(event, doc.serverUID);
    }
}

async function requestSpecificUserProfile(event, userServerUID) {
    const publicKey = helper.getPublicKey();
    const newSocket = socketClient("http://localhost:8000", {
            reconnectionDelayMax: 10000,
            path: '/socket.io/sockets/' + userServerUID
    });
    await newSocket.emit("request-user-profile", {"publicKey": publicKey}, (response) => {
        console.log("response from socket");
        helper.decryptData(response);
        console.log(response);
        if (response.status === 'ok') {
            console.log("here")
            let profile = response.profile;
            profile["serverUID"] = userServerUID;
            event.reply("return-user-profiles", profile)
        }
    });
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

ipcMain.on("get-active-resources", (event, args) => {
    console.log("GETTING ACTIVE RESOURCES [MAIN]");
    // event.reply("return-active-resources", helper.getActiveResources());
    helper.getActiveResources().toArray((err, documents) => {
        if (err) throw err;

        event.reply("return-active-resources", documents);
    })
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

ipcMain.on("view-file", (event, args) => {
    const win = new PDFWindow({
        width: 800,
        height: 600
    });
    // win.loadURL(__dirname + '/../Repository/' + args.filename)

    const output = helper.getFilePath(args.fileid, args.filename);
    console.log("in view-file");
    console.log(output);
    console.log(args.fileid);
    if (output?.filepath) {
        console.log("here for some reason");
        console.log(output?.filepath)
        win.loadURL(output.filepath);
    }
    else {
        // make a request to server uid for downloading fileid
        console.log("initiating resource request");
        // console.log(helper.getFileStream(args.fileid));
        helper.getActiveResources().toArray((err, documents) => {
            if (err) throw err;
    
            let serverUID = null;
            documents.forEach((file) => {
                if (file.fileid === args.fileid) {
                    serverUID = file.serverUID;
                }
            });
            console.log(serverUID);
            const newSocket = socketClient("http://localhost:8000", {
                reconnectionDelayMax: 10000,
                path: '/socket.io/sockets/' + serverUID
            });
            console.log("Connected to " + serverUID);
            socketServers.push(newSocket);
            newSocket.emit("request-resource", {fileid: args.fileid}, (response) => {
                console.log("Response from socket");
                // write this buffer to a new file
                console.log(response);
                if (response.status === 'ok') {
                    const tempFilePath = helper.createTempFile(response.buffer, args.filename);
                    win.loadURL(tempFilePath);
                }
            });
        });
    }
});

ipcMain.on("get-user-profiles", (event, args) => {
    console.log("Fetching user profiles");
    helper.getActiveServers().toArray((err, documents) => {
        if (err) throw err;
        requestUserProfiles(event, documents)
    })
});

ipcMain.on("get-active-chats", (event, args) => {
    console.log("Fetching active chats");
    event.reply("return-active-chats", helper.getActiveChats());
});

ipcMain.on("send-query", (event, args) => {
    // event.reply("return-query-resources", helper.sendMLQuery(args.query));
    const result = helper.sendMLQuery(args.query);
    result.authors.forEach((serverUID) => {
        requestSpecificUserProfile(event, serverUID);
    });
    event.reply("return-query-resources", {resources: result.resources});
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