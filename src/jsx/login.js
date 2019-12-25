import {requestPost, onResponse} from "./request.js"


const makeRegister = (login, password, dogname, username) => {
    let msg = {
        login: login,
        password: password,
        dogname: dogname,
        username: username,
    }
    requestPost('/register', JSON.stringify(msg), response => {
        onResponse(response, (answer) => {
            if (answer === "Ok") {
                console.log("Registered")
                makeLogin(login, password)
            } else if (answer === "Exists") {
                alert("User with this login already exists")
            } else {
                console.log("Unexpected problem")
            }
        })
    })
}

const makeLogin = (login, password) => {
    let form = document.getElementById("treasure-enter-form")
    let msg = {
        login: login,
        password: password,
    }
    requestPost('/login', JSON.stringify(msg), response => {
        onResponse(response, (answer) => {
            if (answer === "Ok") {
                ReactDOM.render(
                    <YouLogged />,
                    form
                )
            } else if ((answer === "User not found") || (answer === "Wrong password")) {
                alert("Wrong login or password")
            } else {
                console.log("Unexpected error")
            }
        })
    })
}

const YouLogged = () => {
    return (
        <div className="tresure-logged-message">
            <h3> You are logged </h3>
            <a href="/treasure-user.html">
                <h3> Go to info </h3>
            </a>
        </div>
    )
}

const onClickRegister = () => {
    let login = document.getElementById("treasure-enter-login").value
    let password = document.getElementById("treasure-enter-password").value
    let dogname = document.getElementById("treasure-enter-dogname").value
    let username = document.getElementById("treasure-enter-username").value
    makeRegister(login, password, dogname, username)
}

const onClickLogin = () => {
    let form = document.getElementById("treasure-enter-form")
    let login = document.getElementById("treasure-enter-login").value
    let password = document.getElementById("treasure-enter-password").value
    makeLogin(login, password)
}

const login = () => {
    let flag_login = document.getElementById("flag-login").
        getAttribute("flag")
    let button = document.getElementById("treasure-enter-button")
    if (flag_login === "yes") {
        button.addEventListener("click", onClickLogin)
    } else {
        button.addEventListener("click", onClickRegister)
    }
}

login()
