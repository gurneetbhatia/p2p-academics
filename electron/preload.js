const helper = require('./helper');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    }

    if (helper.checkIfInitialised()) {
        replaceText("text", "Initialised");
    } else {
        replaceText("text", "Not Initialised");
    }
});