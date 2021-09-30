const fs = require('fs');
const { MongoClient } = require('mongodb');
const { contextBridge, ipcRenderer } = require('electron');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;

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

module.exports = {
    checkIfInitialised: checkIfInitialised
}