const fs = require('fs');
const { MongoClient } = require('mongodb');

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
    const dir = '~/p2p/user/meta';

    if (fs.existsSync(dir)) {
        console.log('Initialised');
        return true;
    } else {
        console.log('Not Initialised');
        return false;
    }
}

function registerUser(data) {
    let content = {
        name: data.name,
        email: data.email,
        knowledgeDomains: []
    };
    const filepath = '~/p2p/user/meta.txt';
    fs.writeFile(filepath, content, (err) => {
        return console.log(err);
    });
    console.log("User file saved locally");
}

module.exports = {
    checkIfInitialised: checkIfInitialised,
    registerUser: registerUser
}