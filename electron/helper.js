const fs = require('fs');

function checkIfInitialised() {
    const dir = '~/p2p/repository';

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