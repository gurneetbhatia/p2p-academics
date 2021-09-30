
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            const validChannels = ["register", "navigate-to"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = [];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => fn(...args));
            }
        }
    }
)


window.sendToElectron = function(channel) {
    ipcRenderer.send(channel);
}

ipcRenderer.on('register', function() {
    console.log("register event raised");
})