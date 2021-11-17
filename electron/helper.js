const fs = require('fs');
const { MongoClient } = require('mongodb');
const { contextBridge, ipcRenderer, dialog } = require('electron');
const path = require('path');
const crypto = require('crypto');

const dbUri = "mongodb+srv://dbUser:dbUserPassword@third-year-project.elclq.mongodb.net/desktop-app?retryWrites=true&w=majority";
let client;
async function connectToMongo() {
    client = await MongoClient.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("CONNECTED TO MONGO");
}

function checkIfInitialised() {
    const dir = './user/meta.txt';

    if (fs.existsSync(dir)) {
        console.log('Initialised');
        return true;
    } else {
        console.log('Not Initialised');
        return false;
    }
}

function getRepositoryResources() {
    const directoryPath = __dirname + '/../Repository';
    const filenames = fs.readdirSync(directoryPath);
    const filesMeta = JSON.parse(fs.readFileSync(directoryPath + '/meta.json'));
    console.log(filesMeta);
    let fileObjs = [];
    filenames.forEach((filename) => {
        if (filename !== "meta.json") {
            // check if the filename exists in filenames
            let metaObj;
            filesMeta.some((element) => {
                console.log(element.filename);
                if (element.filename === filename) {
                    metaObj = element
                    return true;
                } else {
                    metaObj =  {
                        filename: filename,
                        title: undefined,
                        abstract: undefined,
                        authors: undefined,
                        knowledgeDomains: undefined
                    };
                    return false;
                }
            });
            fileObjs.push(metaObj);
        }
    })

    return fileObjs;
}

function generateServerUID() {
    var hash = crypto.randomBytes(20).toString('hex');
    console.log("UNIQUE SERVER ID: " + hash)
    return hash;
}

function reserveServerUID(serverUID) {
    const db = client.db("desktop-app");
    db.collection("active-servers").insertOne({serverUID: serverUID, offVotes: []});
}

function fetchActiveServers() {
    const db = client.db("desktop-app");
    return db.collection("active-servers").find()
}

function updateResourcesList(serverUID) {
    const db = client.db("desktop-app");
    fs.readdir(__dirname + '/../Repository', (err, files) => {
        if (err) {
            console.log("Unable to scan directory: " + err);
        }
        const rescourcesCollection = db.collection("resources");
        files.forEach((file) => {
            rescourcesCollection.insertOne({serverUID: serverUID, filename: file, knowledgeDomains: [], author: 'some author'});
        })
    });
}

function closeApplication(serverUID) {
    console.log("CLOSING APPLICATION [HELPER]")
    // from active-servers, remove the instance where the serverUID matches
    // from resources, take down all objects where the serverUID matches
    const db = client.db("desktop-app");
    const serversCollection = db.collection("active-servers");
    const resourcesCollection = db.collection("resources");
    serversCollection.deleteOne({serverUID: serverUID});
    resourcesCollection.deleteMany({serverUID: serverUID});
}

function handleUploadFilesClick() {
    console.log("Upload file clicked [HELPER]");
    // const properties = process.platform === 'darwin' ? ['openFile', 'openDirectory'] : ['multiSelections'];
    dialog.showOpenDialog({
        title: 'Select the file to be uploaded',
        defaultPath: '~/',
        buttonLabel: 'Upload',
        filters: [
            {
                name: 'PDF Files',
                extensions: ['pdf']
            }
        ],
        properties: ['multiSelections']
    }).then(files => {
        console.log(files.canceled);
        if (!files.canceled) {
            // global.filesUploadPath = files.filePaths;
            console.log(files.filePaths);
            // upload files to the application Repository directory
            copyFilesToRepo(files.filePaths);
        }
    }).catch(err => {
        console.log(err);
    });
}

function copyFilesToRepo(filepaths) {
    const directoryPath = __dirname + '/../Repository/';
    filepaths.forEach(filepath => {
        const filename = path.basename(filepath);
        fs.copyFile(filepath, directoryPath + filename, (err) => {
            if (err) throw err;
            console.log(err);
        });
    });
}

function deleteResource(filename) {
    const directoryPath = __dirname + '/../Repository/';
    fs.unlinkSync(directoryPath + filename);
}

module.exports = {
    checkIfInitialised: checkIfInitialised,
    getRepositoryResources: getRepositoryResources,
    generateServerUID: generateServerUID,
    reserveServerUID: reserveServerUID,
    connectToMongo: connectToMongo,
    fetchActiveServers: fetchActiveServers,
    updateResourcesList: updateResourcesList,
    closeApplication: closeApplication,
    handleUploadFilesClick: handleUploadFilesClick,
    deleteResource: deleteResource
}