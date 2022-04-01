const fs = require('fs');
const { MongoClient } = require('mongodb');
const { contextBridge, ipcRenderer, dialog } = require('electron');
const path = require('path');
const crypto = require('crypto');
const { generateKeyPair } = require('crypto');
const pdf = require('pdf-parse');
const axios = require('axios');

const API_BASE_URL = "localhost:5000/";

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
    const dir = './user/meta.json';

    if (fs.existsSync(dir)) {
        console.log('Initialised');
        return true;
    } else {
        console.log('Not Initialised');
        return false;
    }
}

function setupEncryption(serverUID) {
    // used answer from https://stackoverflow.com/questions/8520973/how-to-create-a-pair-private-public-keys-using-node-js-crypto
    generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: serverUID
        }
    }, (err, publicKey, privateKey) => {
        if (err) throw err;

        fs.writeFileSync(__dirname + '/../user/keys.json', {"publicKey": publicKey, "privateKey": privateKey});
    });
}

function getPublicKey() {
    const keys = fs.readFileSync(__dirname + '/../user/keys.json');
    return keys.publicKey;
}

function encryptData(data, publicKey) {
    // using code from https://www.sohamkamani.com/nodejs/rsa-encryption/
    // const publicKey = getPublicKey();
    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        },
        Buffer.from(data)
    );

    return encryptedData;
}

function decryptData(data) {
    const keys = fs.readFileSync(__dirname + '/../user/keys.json');
    const privateKey = keys.privateKey;

    // using code from https://www.sohamkamani.com/nodejs/rsa-encryption/
    const decryptedData = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        },
        data
    );

    return decryptedData;
}

function initialiseNetworkGraph() {
    let counter = 0;

    let index_mappings = {};
    getActiveServers().toArray((err, document) => {
        if (err) throw err;
        index_mappings[counter] = document.serverUID;

        counter += 1;
    });

    let graph = new Graph(counter);
    const parents = graph.prims_mst();

    // now convert the indices in parents to an actual graph with serverUIDs from index_mappings
    let graphConnections = {};
    for (let index = 0;index < counter;index++) {
        graphConnections[index_mappings[index]] = graphConnections[index_mappings[parents[index]]];
    }

    return graphConnections;
}

// The following classes (node1, Graph, and node) and functions (addEdge, prims_mst) are adapted from https://www.geeksforgeeks.org/prims-mst-for-adjacency-list-representation-greedy-algo-6/

class node1
{
	constructor(a,b)
	{
		this.dest = a;
		this.weight = b;
	}
}

class Graph
{
	constructor(e)
	{
		this.V=e;
		this.adj = new Array(V);
		for (let o = 0; o < V; o++)
			this.adj[o] = [];
	}
}

// class to represent a node in PriorityQueue
	// Stores a vertex and its corresponding
	// key value
class node
{
	constructor()
	{
		this.vertex=0;
		this.key=0;
	}
}

// method to add an edge
	// between two vertices
function addEdge(graph,src,dest,weight)
{
	let node0 = new node1(dest, weight);
		let node = new node1(src, weight);
		graph.adj[src].push(node0);
		graph.adj[dest].push(node);
}

// method used to find the mst
function prims_mst(graph)
{
	// Whether a vertex is in PriorityQueue or not
    let mstset = new Array(graph.V);
    let e = new Array(graph.V);

    // Stores the parents of a vertex
    let parent = new Array(graph.V);

    for (let o = 0; o < graph.V; o++)
    {
        
        e[o] = new node();
    }
    for (let o = 0; o < graph.V; o++) {

        // Initialize to false
        mstset[o] = false;

        // Initialize key values to infinity
        e[o].key = Number.MAX_VALUE;
        e[o].vertex = o;
        parent[o] = -1;
    }

    // Include the source vertex in mstset
    mstset[0] = true;

    // Set key value to 0
    // so that it is extracted first
    // out of PriorityQueue
    e[0].key = 0;

    // Use TreeSet instead of PriorityQueue as the remove function of the PQ is O(n) in java.
    let queue = [];

    for (let o = 0; o < graph.V; o++)
        queue.push(e[o]);
    
    queue.sort(function(a,b){return a.key-b.key;});

    // Loops until the queue is not empty
    while (queue.length!=0) {

        // Extracts a node with min key value
        let node0 = queue.shift();

        // Include that node into mstset
        mstset[node0.vertex] = true;

        // For all adjacent vertex of the extracted vertex V
        for (let iterator of graph.adj[node0.vertex].values()) {

            // If V is in queue
            if (mstset[iterator.dest] == false) {
                // If the key value of the adjacent vertex is
                // more than the extracted key
                // update the key value of adjacent vertex
                // to update first remove and add the updated vertex
                if (e[iterator.dest].key > iterator.weight) {
                    queue.splice(queue.indexOf(e[iterator.dest]),1);
                    e[iterator.dest].key = iterator.weight;
                    queue.push(e[iterator.dest]);
                    queue.sort(function(a,b){return a.key-b.key;});
                    parent[iterator.dest] = node0.vertex;
                }
            }
        }
    }

    return parent;
}

function getRepositoryResources() {
    const directoryPath = __dirname + '/../Repository';
    const filenames = fs.readdirSync(directoryPath);
    const filesMeta = JSON.parse(fs.readFileSync(directoryPath + '/meta.json'));
    console.log(filesMeta);
    let fileObjs = [];
    filenames.forEach((filename) => {
        if (filename !== "meta.json") {
            // check if the filename exists in meta.json
            let metaObj;
            filesMeta.some((element) => {
                console.log(element.filename);
                if (element.filename === filename) {
                    metaObj = element
                    fileObjs.push(metaObj);
                    return true;
                }
            });
            if (!metaObj) {
                const fileid = generateServerUID();
                const dataBuffer = fs.readFileSync(directoryPath + '/' + filename);
                pdf(dataBuffer).then((fileParsedData) => {
                    metaObj = {
                        fileid: fileid,
                        filename: filename,
                        title: fileParsedData.info.Title,
                        author: fileParsedData.info.Author,
                        abstract: undefined,
                        knowledgeDomains: fileParsedData.info.Keywords
                    };
                    fileObjs.push(metaObj);
                });
            }
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
    return db.collection("active-servers").find();
}

function updateResourcesList(serverUID) {
    const db = client.db("desktop-app");
    var files = getRepositoryResources();
    const resourcesCollection = db.collection("resources");
    var remoteResourcesCursor = resourcesCollection.find({serverUID: serverUID});
    remoteResourcesCursor.forEach((resc) => {
        files = files.filter((file) => {
            // remove any files that are already on the remote database
            return file.fileid !== resc.fileid;
        });
    });
    // push the remaining files to the database
    files.forEach((file) => {
        file["serverUID"] = serverUID;
        resourcesCollection.insertOne(file);
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

function updateResource(fileprops) {
    const newFileObj = {
        fileid: fileprops.fileid,
        filename: fileprops.filename,
        title: fileprops.title,
        abstract: fileprops.abstract,
        authors: fileprops.authors,
        knowledgeDomains: fileprops.knowledgeDomains
    }
    // if the filename doesn't already exist in meta.json, we initialise a new object
    // otherwise we update the relevant object with the new properties from fileprops
    console.log("Update Resource [HELPER]");
    let metaFileObjects = getRepositoryResources();
    let updatedObjects = [];
    metaFileObjects.forEach((object) => {
        console.log(object.filename + " " + fileprops.filename + " " + object.filename === fileprops.filename);
        if (object.filename === fileprops.filename) {
            updatedObjects.push(newFileObj);
        } else {
            updatedObjects.push(object);
        }
    });

    const filepath = './Repository/meta.json';
    const content = JSON.stringify(updatedObjects);

    fs.writeFileSync(filepath, content);

    console.log(updatedObjects);

}

function getActiveResources(serverUID) {
    // return all resources from the database where the serverUID is not the argument provided
    const db = client.db("desktop-app");
    const resourcesCollection = db.collection("resources");

    return resourcesCollection.find();
}

function getFilePath(fileid, filename) {
    const directoryPath = __dirname + '/../Repository/';
    const filesMeta = JSON.parse(fs.readFileSync(directoryPath + 'meta.json'));
    let metaObj;
    filesMeta.some((element) => {
        console.log(element.filename);
        if (element.fileid === fileid) {
            metaObj = element
            return true;
        }
    });
    if (metaObj) {
        return {filepath: directoryPath + filename};
    }

    // the file could not be located locally so we need to fetch the remote version of it
    return null;
}

function getFileBuffer(fileid) {
    console.log("GET FILE STREAM 0");
    const resources = getRepositoryResources();
    console.log(resources);
    const directoryPath = __dirname + '/../Repository/';

    // const stream = fs.createReadStream(directoryPath);
    const filesMeta = JSON.parse(fs.readFileSync(directoryPath + 'meta.json'));
    let metaObj;
    filesMeta.some((element) => {
        if (element.fileid === fileid) {
            metaObj = element
            return true;
        }
    });
    if (metaObj) {
        console.log("HERE")
        const buffer = fs.readFileSync(directoryPath + metaObj.filename);
        return buffer;
    }

    return null;
}

function createTempFile(buffer, filename) {
    const directoryPath = __dirname + '/../Temp/';
    // fs.writeFileSync(directoryPath + filename, buffer);
    fs.open(directoryPath + filename, 'w', (err, file) => {
        if (err) throw err;

        fs.writeFileSync(directoryPath + filename, buffer);
    })
    return directoryPath + filename;
}

function getActiveServers() {
    const db = client.db("desktop-app");
    const serversCollection = db.collection("active-servers");

    return serversCollection.find();
}

function getUserProfile() {
    return JSON.parse(fs.readFileSync("./user/meta.json"));
}

function getActiveChats() {
    return JSON.parse(fs.readFileSync("./user/chats.json"));
}

async function sendMLQuery(query) {
    const response = await axios.get(API_BASE_URL + 'get-papers-and-authors?query=' + query);
    if (response.status === 'ok') {
        //return response;
        // response contains author and paper IDs
        // we now need to fetch the papers here from the IDs
        // the authors will be fetched using sockets in main.js
        let papers = []
        papers.forEach((paperId) => {
            const resourcesCollection = db.collection("resources");
            let result = resourcesCollection.findOne({fileid: paperId});
            papers.push(JSON.parse(result));
        });
        return {resources: papers, authors: response.authors};
    }
    console.log('request failed for some reason');
    return {authors: [], papers: []};
}

function addMessage(senderUID, message, timestamp, sender) {
    let messages = JSON.parse(fs.readFileSync('./user/chats.json'));
    if (!messages.hasOwnProperty(senderUID)) {
        messages[senderUID] = [];
    }

    messages[senderUID].push({
        message: message,
        timestamp: timestamp,
        sender: sender
    });

    fs.writeFileSync('./user/chats.json', messages);
}

function receiveMessage(sender, message, timestamp) {
    addMessage(sender, message, timestamp, false)
}

function sendMessage(sender, message, timestamp) {
    addMessage(sender, message, timestamp, true);
}

module.exports = {
    checkIfInitialised: checkIfInitialised,
    initialiseNetworkGraph: initialiseNetworkGraph,
    getRepositoryResources: getRepositoryResources,
    generateServerUID: generateServerUID,
    reserveServerUID: reserveServerUID,
    connectToMongo: connectToMongo,
    fetchActiveServers: fetchActiveServers,
    updateResourcesList: updateResourcesList,
    closeApplication: closeApplication,
    handleUploadFilesClick: handleUploadFilesClick,
    deleteResource: deleteResource,
    updateResource: updateResource,
    getActiveResources: getActiveResources,
    getFilePath: getFilePath,
    getFileBuffer: getFileBuffer,
    createTempFile: createTempFile,
    getActiveServers: getActiveServers,
    getUserProfile: getUserProfile,
    getActiveChats: getActiveChats,
    sendMLQuery: sendMLQuery,
    setupEncryption: setupEncryption,
    getPublicKey: getPublicKey,
    encryptData: encryptData,
    decryptData: decryptData,
    receiveMessage: receiveMessage,
    sendMessage: sendMessage
};