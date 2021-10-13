const fs = require('fs');
const { MongoClient } = require('mongodb');
const { contextBridge, ipcRenderer } = require('electron');
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
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.log("Unable to scan directory: " + err)
        }

        return files;
    })
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
    // return findResult.toArray((err, result) => {
    //     console.log(err);
    //     console.log(result);
    // })
    // return db.collection("active-servers").find();
}

module.exports = {
    checkIfInitialised: checkIfInitialised,
    getRepositoryResources: getRepositoryResources,
    generateServerUID: generateServerUID,
    reserveServerUID: reserveServerUID,
    connectToMongo: connectToMongo,
    fetchActiveServers: fetchActiveServers
}