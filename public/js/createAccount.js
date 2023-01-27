import util from "./util.js"

document.querySelector('form button').addEventListener("click", async e => {
    let newAccountInfos = {
        username: document.querySelector('#create-username').value,
        pass: document.querySelector('#create-username').value,
        passConfirm: document.querySelector('#create-username').value,
        profilePic: true
    }

    let validInfos = util.validateUsername(newAccountInfos.username);
    validInfos = util.validatePassword(newAccountInfos.pass, newAccountInfos.passConfirm);

    if (validInfos == true) {
        delete newAccountInfos.passConfirm;
        await util.criarConta(newAccountInfos);
    }

})