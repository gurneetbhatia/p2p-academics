
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            const validChannels = ["register", "navigate-to", "get-repo-resources"];
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