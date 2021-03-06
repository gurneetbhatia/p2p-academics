const { contextBridge, ipcRenderer, dialog } = require('electron');

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            const validChannels = [
                "register",
                "navigate-to",
                "get-repo-resources",
                "upload-files-click",
                "delete-resource",
                "update-resource",
                "get-active-resources",
                "view-file",
                "get-user-profiles",
                "get-active-chats",
                "send-query"
            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            const validChannels = [
                "return-repo-resources",
                "return-active-resources",
                "return-user-profiles",
                "return-active-chats",
                "return-query-results"
            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
)


window.sendToElectron = function(channel) {
    ipcRenderer.send(channel);
}