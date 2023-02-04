import util from "./util.js";

let isLogged = window.localStorage.getItem('isLogged');

if (isLogged == 'true') {
    document.querySelector('form#login').style.display = 'none'
    document.querySelector('#roomSearch').style.display = 'flex'
    document.querySelector('figure h1').innerHTML = localStorage.getItem('username')
    document.querySelector('figure img').src = await util.getImg(localStorage.getItem('profilePic'))
} else {
    document.querySelector('form#login').style.display = 'flex'
    document.querySelector('#roomSearch').style.display = 'none'
    document.querySelector('figure h1').innerHTML = 'FantasmagorE'
}

document.querySelector('#logbutton').addEventListener("click", e => {
    let userInfos = {
        username: document.querySelector('#username').value,
        pass: document.querySelector('#password').value
    }

    util.enviarLogin(userInfos.username, userInfos.pass).then(async res => {
        if (res.ok) {
            util.save(await res.json())
            localStorage.setItem('isLogged', true)
            window.open('../index.html', '_self')
        }
    })
})