import {createPost, newPost, getCookie} from "./html.js";
import {requestPost, onResponse} from "./request.js";

const onClickPost = () => {
    const content = document.getElementById("treasure-post-placeholder").value;
    const topic = document.getElementById("treasure-post-topic").value;
    let token = getCookie("token")

    let error = [];
    if (content === "") {
        error.push("content is empty")
    } 
    if (topic === "") {
        error.push("topic is empty")
    }

    if (error.length === 0) {
        let msg = {
            content: content,
            topic: topic,
            token: token,
        }
        let post = JSON.stringify(msg)
        document.getElementById("treasure-post-placeholder").value = ""
        document.getElementById("treasure-post-topic").value = ""
        createPost(post);
    } else {
        alert(error)
    }
}

const main = () => {
    let news = document.getElementById("treasure-news-placeholder");
    let button = document.getElementById("treasure-post-button");

    let inputTopic = document.getElementById("treasure-post-topic");

    button.addEventListener("click", onClickPost);
    inputTopic.addEventListener("input", (e) => {
      let msg = e.target.value;
      e.target.value = msg.charAt(0).toUpperCase() + msg.substring(1);
    })
}

main()
