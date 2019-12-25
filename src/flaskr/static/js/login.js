import { requestPost, onResponse } from "./request.js";

var makeRegister = function makeRegister(login, password, dogname, username) {
    var msg = {
        login: login,
        password: password,
        dogname: dogname,
        username: username
    };
    requestPost('/register', JSON.stringify(msg), function (response) {
        onResponse(response, function (answer) {
            if (answer === "Ok") {
                console.log("Registered");
                makeLogin(login, password);
            } else if (answer === "Exists") {
                alert("User with this login already exists");
            } else {
                console.log("Unexpected problem");
            }
        });
    });
};

var makeLogin = function makeLogin(login, password) {
    var form = document.getElementById("treasure-enter-form");
    var msg = {
        login: login,
        password: password
    };
    requestPost('/login', JSON.stringify(msg), function (response) {
        onResponse(response, function (answer) {
            if (answer === "Ok") {
                ReactDOM.render(React.createElement(YouLogged, null), form);
            } else if (answer === "User not found" || answer === "Wrong password") {
                alert("Wrong login or password");
            } else {
                console.log("Unexpected error");
            }
        });
    });
};

var YouLogged = function YouLogged() {
    return React.createElement(
        "div",
        { className: "tresure-logged-message" },
        React.createElement(
            "h3",
            null,
            " You are logged "
        ),
        React.createElement(
            "a",
            { href: "/treasure-user.html" },
            React.createElement(
                "h3",
                null,
                " Go to info "
            )
        )
    );
};

var onClickRegister = function onClickRegister() {
    var login = document.getElementById("treasure-enter-login").value;
    var password = document.getElementById("treasure-enter-password").value;
    var dogname = document.getElementById("treasure-enter-dogname").value;
    var username = document.getElementById("treasure-enter-username").value;
    makeRegister(login, password, dogname, username);
};

var onClickLogin = function onClickLogin() {
    var form = document.getElementById("treasure-enter-form");
    var login = document.getElementById("treasure-enter-login").value;
    var password = document.getElementById("treasure-enter-password").value;
    makeLogin(login, password);
};

var login = function login() {
    var flag_login = document.getElementById("flag-login").getAttribute("flag");
    var button = document.getElementById("treasure-enter-button");
    if (flag_login === "yes") {
        button.addEventListener("click", onClickLogin);
    } else {
        button.addEventListener("click", onClickRegister);
    }
};

login();