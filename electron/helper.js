const fs = require('fs');
const { MongoClient } = require('mongodb');
const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const crypto = require('crypto');

const dbUri = "mongodb+srv://dbUser:dbUserPassword@third-year-project.elclq.mongodb.net/desktop-app?retryWrites=true&w=majority";
let client;
async function connectToMongo() {
    client = await MongoClient.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}
// const client = MongoClient.connect(dbUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// const db = client.db("desktop-app");

// function pushServerToDB(serverUID) {
//     client.connect(err => {
//         const collection = client.db("desktop-app").collection("active-servers");
//         // server.id: offVoteCount
//         collection.insertOne({serverUID: serverUID, offVoteCount: 0}, (err, db) => {
//             if (err) throw err;
//             console.log("Inserted " + serverUID);
//             db.close();
//         })
//         client.close();
//     })
// }

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
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.log("Unable to scan directory: " + err)
        }

        return files;
    })
}

function generateServerUID() {
    // var maxUID = 0;
    // client.connect(err => {
    //     console.log(err);
    //     const collection = client.db("desktop-app").collection("active-servers");
    //     // server.id: offVoteCount
    //     collection.find().forEach((object) => {
    //         if (object.serverUID > maxUID) {
    //             maxUID = object.serverUID + 1;
    //         }
    //     })
    //     console.log("MAX AVAILABLE SERVER ID: " + maxUID);
    //     client.close();
    //     return maxUID;
    // });
    var hash = crypto.randomBytes(20).toString('hex');
    console.log("UNIQUE SERVER ID: " + hash)
    return hash;
}

function reserveServerUID(serverUID) {
    // client.connect(err => {
    //     const session = client.startSession();
    //     if (err) throw err;
    //     const collection = client.db("desktop-app").collection("active-servers");
    //     collection.insertOne({serverUID: serverUID, offVotes: []});
    //     client.close();
    // });
    const db = client.db("desktop-app");
    db.collection("active-servers").insertOne({serverUID: serverUID, offVotes: []});
}

module.exports = {
    checkIfInitialised: checkIfInitialised,
    getRepositoryResources: getRepositoryResources,
    generateServerUID: generateServerUID,
    reserveServerUID: reserveServerUID,
    connectToMongo: connectToMongo
}