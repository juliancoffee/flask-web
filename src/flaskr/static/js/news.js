import { createPost, newPost, getCookie } from "./html.js";
import { requestPost, onResponse } from "./request.js";

var onClickPost = function onClickPost() {
    var content = document.getElementById("treasure-post-placeholder").value;
    var topic = document.getElementById("treasure-post-topic").value;
    var token = getCookie("token");

    var error = [];
    if (content === "") {
        error.push("content is empty");
    }
    if (topic === "") {
        error.push("topic is empty");
    }

    if (error.length === 0) {
        var msg = {
            content: content,
            topic: topic,
            token: token
        };
        var post = JSON.stringify(msg);
        document.getElementById("treasure-post-placeholder").value = "";
        document.getElementById("treasure-post-topic").value = "";
        createPost(post);
    } else {
        alert(error);
    }
};

var main = function main() {
    var news = document.getElementById("treasure-news-placeholder");
    var button = document.getElementById("treasure-post-button");

    var inputTopic = document.getElementById("treasure-post-topic");

    button.addEventListener("click", onClickPost);
    inputTopic.addEventListener("input", function (e) {
        var msg = e.target.value;
        e.target.value = msg.charAt(0).toUpperCase() + msg.substring(1);
    });
};

main();