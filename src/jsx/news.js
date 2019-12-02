const onClickPost = () => {
    const content = document.getElementById("treasure-post-placeholder").value;
    const theme = document.getElementById("treasure-post-theme").value;
    let error = [];
    if (content === "") {
        error.push("content is empty")
    } 
    if (theme === "") {
        error.push("theme is empty")
    }

    if (error.length === 0) {
        newPost(content, theme);
    } else {
        console.log(error)
    }
}

const newPost = (content, theme) => {
    let posts = document.getElementById("treasure-news-placeholder");
    let newsDiv = div();

    let contentDiv = div();
    contentDiv.setAttribute("class", "treasure-post-content")
    let newsHeader = header();

    let textTheme = text(theme);
    let textContent = text(content);

    newsHeader.appendChild(textTheme);
    contentDiv.appendChild(textContent);

    newsDiv.appendChild(newsHeader);
    newsDiv.appendChild(contentDiv);

    posts.insertBefore(newsDiv, posts.firstChild);
}

const div = () => document.createElement("div");
const header = () => document.createElement("h2");
const text = (textStr) => document.createTextNode(textStr);

let news = document.getElementById("treasure-news-placeholder")
let button = document.getElementById("treasure-post-button")
let inputTheme = document.getElementById("treasure-post-theme")

button.addEventListener("click", onClickPost)
inputTheme.addEventListener("input", (e) => {
  let msg = e.target.value;
  e.target.value = msg.charAt(0).toUpperCase() + msg.substring(1);
})
