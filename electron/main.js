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

let socketServers = []

let socketServerUID;

async function initialiseServer() {
    await helper.connectToMongo();
    // get a unique server UID for our client and reserve it in the database
    socketServerUID = helper.generateServerUID();
    helper.reserveServerUID(socketServerUID);
    // renew the public and private keys of data security
    helper.setupEncryption(socketServerUID);
    // initialise the socket server
    io.attach(8080, {
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false,
        path: '/socket.io/sockets/' + socketServerUID
    });

    // listen for connections to our socket server
    io.on('connection', (socket) => {
        console.log("client connection detected");
        socket.on("request-resource", (args, callback) => {
            // a client has requested a file
            console.log("resource request detected [SOCKET]");
            console.log(args);
            const fileBuffer = helper.getFileBuffer(args.fileid);
            const output = fileBuffer ? {status: 'ok', buffer: fileBuffer} : {status: 'fail', fileBuffer: null}
            callback(output);
        });

        socket.on("request-user-profile", (args, callback) => {
            // a client has requested this users' profile
            console.log("user profile request detected [SOCKET");
            const profile = helper.getUserProfile();
            // send the profile back in an encrypted format using the public key that they have provided
            callback(helper.encryptData({
                status: 'ok',
                profile: profile
            }, args.publicKey));
        });

        socket.on("receive-message", (args, callback) => {
            // add the message that we have received to our local copy of the chat
            const argsData = helper.decryptData(args);
            const sender = argsData.sender;
            const message = argsData.message;
            const timestamp = argsData.timestamp;

            helper.receiveMessage(sender, message, timestamp);
        });
    });
    helper.updateResourcesList(socketServerUID);
}
initialiseServer();

const baseUrl = 'http://localhost:3000';

let win;

function createWindow() {
    // initialise the browser window that will be linked up by electron and used for our frontend
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // check if the user has already registered this device and if not take them to the registration page first
    const extension = helper.checkIfInitialised() ? '/' : '/register';
    win.loadURL(baseUrl + extension);

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
    // request all user profiles on the network
    for(doc of documents) {
        requestSpecificUserProfile(event, doc.serverUID);
    }
}

async function requestSpecificUserProfile(event, userServerUID) {
    // request the user profile of a specific user
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
    // register user with the arguments received from the frontend
    registerUser(args);
});

ipcMain.on("navigate-to", (path) => {
    // path change request from frontend
    win.loadUrl(baseUrl + path);
});

ipcMain.on("get-repo-resources", (event, args) => {
    // send a list of objects containing the resources held locally to the frontend
    console.log("GETTING REPO RESOURCES [MAIN]");
    event.reply("return-repo-resources", helper.getRepositoryResources());
});

ipcMain.on("get-active-resources", (event, args) => {
    // get remote resources from the mongodb database
    console.log("GETTING ACTIVE RESOURCES [MAIN]");
    helper.getActiveResources().toArray((err, documents) => {
        if (err) throw err;

        event.reply("return-active-resources", documents);
    })
});

ipcMain.on("upload-files-click", (event, args) => {
    // add the new file
    console.log("Upload files clicked [MAIN]");
    helper.handleUploadFilesClick();
});

ipcMain.on("delete-resource", (event, args) => {
    // delete a resource
    console.log("Deleting resource [MAIN]");
    console.log(args);
    helper.deleteResource(args);
});

ipcMain.on("update-resource", (event, args) => {
    // update the metadata of a resource
    helper.updateResource(args);
});

ipcMain.on("view-file", (event, args) => {
    const win = new PDFWindow({
        width: 800,
        height: 600
    });

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