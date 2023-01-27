import util from "./util.js";

let isLogged = window.localStorage.getItem('isLogged');

if (isLogged == 'true') {
    document.querySelector('form#login').style.display = 'none'
    document.querySelector('#roomSearch').style.display = 'flex'
    document.querySelector('figure h1').innerHTML = window.localStorage.getItem('username')
} else {
    document.querySelector('form#login').style.display = 'flex'
    document.querySelector('#roomSearch').style.display = 'none'
    document.querySelector('figure h1').innerHTML = 'FantasmagorE'
}

document.querySelector('#logbutton').addEventListener("click", e =>{
    let userInfos = {
        username: document.querySelector('#username').value,
        pass: document.querySelector('#password').value
    }
})