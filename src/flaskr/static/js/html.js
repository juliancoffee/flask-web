import { requestPost, onResponse } from "./request.js";

var div = function div() {
    return document.createElement("div");
};
var header = function header() {
    return document.createElement("h2");
};
var text = function text(textStr) {
    return document.createTextNode(textStr);
};

var clearDiv = function clearDiv(element) {
    element.innerHTML = "";
};

var deleteDiv = function deleteDiv(element) {
    element.parentNode.removeChild(element);
};

var getCookie = function getCookie(name) {
    var cookies = document.cookie.split(";").map(function (el) {
        return el.split("=").map(function (el) {
            return el.trim();
        });
    });
    var result = "";
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = cookies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var c = _step.value;

            if (c[0] === name) {
                result = c[1];
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return result;
};

var newPost = function newPost(content, topic) {
    var posts = document.getElementById("treasure-news-placeholder");
    var newsDiv = div();

    var contentDiv = div();
    contentDiv.setAttribute("class", "treasure-post-content");
    var newsHeader = header();

    var textTopic = text(topic);
    var textContent = text(content);

    newsHeader.appendChild(textTopic);
    contentDiv.appendChild(textContent);

    newsDiv.appendChild(newsHeader);
    newsDiv.appendChild(contentDiv);

    posts.insertBefore(newsDiv, posts.children[1]);
};

var createPost = function createPost(msg) {
    requestPost('/', msg, function (response) {
        onResponse(response, function (answer) {
            var _JSON$parse = JSON.parse(answer),
                topic = _JSON$parse.topic,
                content = _JSON$parse.content;

            newPost(content, topic);
        });
    });
};

export { createPost, newPost, clearDiv, deleteDiv, getCookie };