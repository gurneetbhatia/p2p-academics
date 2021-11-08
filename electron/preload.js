const { contextBridge, ipcRenderer, dialog } = require('electron');
// const electron = 

// const dialog = remote.dialog;

// const uploadFile = document.getElementById("upload-file");
// global.uploadFilesPath = undefined;
// uploadFile.addEventListener('click', handleUploadFileClick);

// function handleUploadFileClick() {
//     console.log("Upload file clicked [HELPER]");
//     // const properties = process.platform === 'darwin' ? ['openFile', 'openDirectory'] : ['multiSelections'];
//     dialog.showOpenDialog({
//         title: 'Select the file to be uploaded',
//         defaultPath: '~/',
//         buttonLabel: 'Upload',
//         filters: [
//             {
//                 name: 'PDF Files',
//                 extensions: ['pdf']
//             }
//         ],
//         properties: ['multiSelections']
//     }).then(files => {
//         console.log(files.canceled);
//         if (!files.canceled) {
//             global.filesUploadPath = files.filePaths;
//             console.log(global.filesUploadPath);
//         }
//     }).catch(err => {
//         console.log(err);
//     });
// }

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            const validChannels = ["register", "navigate-to", "get-repo-resources", "upload-files-click"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["return-repo-resources"];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
)


window.sendToElectron = function(channel) {
    ipcRenderer.send(channel);
}

// ipcRenderer.on("return-repo-resources", (event, response) => {
//     console.log("response from main in renderer");
//     console.log(event);
//     console.log(response);
// })