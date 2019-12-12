import {requestPost} from "./request.js"
const div = () => document.createElement("div");
const header = () => document.createElement("h2");
const text = (textStr) => document.createTextNode(textStr);

const clearDiv = (element) => {
    element.innerHTML = ""
}

const deleteDiv = (element) => {
    element.parentNode.removeChild(element)
}

const getCookie = (name) => {
    let cookies = document.cookie.split(";").
        map((el) => el.
            split("=").
            map((el) => el.trim()))
    let coq = ""
    for (let c of cookies) {
        if (c[0] === name) {
            coq = c[1]
        }
    }

    return coq
}


const newPost = (content, topic, user) => {
    let posts = document.getElementById("treasure-news-placeholder");
    let newsDiv = div();

    let contentDiv = div();
    contentDiv.setAttribute("class", "treasure-post-content")
    let newsHeader = header();

    let textTopic = text(user + ": " + topic);
    let textContent = text(content);

    newsHeader.appendChild(textTopic);
    contentDiv.appendChild(textContent);

    newsDiv.appendChild(newsHeader);
    newsDiv.appendChild(contentDiv);

    posts.insertBefore(newsDiv, posts.children[1]);
}

export {newPost, clearDiv, deleteDiv, getCookie}
