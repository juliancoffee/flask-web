import {requestPost, onResponse} from "./request.js"
import {deleteDiv} from "./html.js"

const onClickLogin = () => {
    let form = document.getElementById("treasure-enter-form")
    let username = document.getElementById("treasure-enter-username").value
    let password = document.getElementById("treasure-enter-password").value
    makeLogin(username, password)
}

const makeLogin = (username, password) => {
    let form = document.getElementById("treasure-enter-form")
    let msg = {
        username: username,
        password: password,
    }
    requestPost('/login', JSON.stringify(msg), response => {
        onResponse(response, (answer) => {
            console.log(answer)
            deleteDiv(form)
        })
    })
}

const makeRegister = (username, password, dogname, name) => {
    let msg = {
        username: username,
        password: password,
        dogname: dogname,
        name: name,
        count: 0,
    }
    requestPost('/register', JSON.stringify(msg), response => {
        onResponse(response, (answer) => {
            if (answer === "Ok") {
                console.log("yes, we did it")
                makeLogin(username, password)
            } else {
                console.log("Error: " + answer)
            }
        })
    })
}

const onClickRegister = () => {
    let username = document.getElementById("treasure-enter-username").value
    let password = document.getElementById("treasure-enter-password").value
    let dogname = document.getElementById("treasure-enter-dogname").value
    let name = document.getElementById("treasure-enter-name").value
    makeRegister(username, password, dogname, name)
}

const login = () => {
    let flag = document.getElementById("flag-login").
        getAttribute("flag")
    let button = document.getElementById("treasure-enter-button")
    if (flag === "yes") {
        console.log("cool")
        button.addEventListener("click", onClickLogin)
    } else {
        console.log("щас порешаем вопросики")
        button.addEventListener("click", onClickRegister)
    }
}

login()
