import util from "./util.js"

/**
 * @type {boolean | string}
 */
let profilePic = true
const inputImg = document.querySelector('#profile-pic')
inputImg.addEventListener("change", () => {
    const reader = new FileReader()
    reader.readAsDataURL(inputImg.files[0])
    reader.addEventListener('load', async () => {
        profilePic = await util.uploadImg(await util.cropImage(reader.result), document.querySelector('label p'))
        console.log(await util.getImg(profilePic))
        document.querySelector('label img').src = await util.getImg(profilePic)
        document.querySelector('label p').innerText = 'Foto de Perfil'
    })
})

document.querySelector('form button').addEventListener("click", async e => {
    let newAccountInfos = {
        username: document.querySelector('#create-username').value,
        pass: document.querySelector('#create-password').value,
        passConfirm: document.querySelector('#confirm-password').value,
        profilePic
    }

    let validInfos = util.validateUsername(newAccountInfos.username)
    validInfos = util.validatePassword(newAccountInfos.pass, newAccountInfos.passConfirm)

    if (validInfos == true) {
        delete newAccountInfos.passConfirm
        await util.criarConta(newAccountInfos)
    }
})