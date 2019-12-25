var requestPost = function requestPost(url, text, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = callback;
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(text);
};

var requestGet = function requestGet(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = callback;
    httpRequest.open('GET', url);
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send();
};

var onResponse = function onResponse(response, callback) {
    var target = response.originalTarget;
    if (target.readyState === XMLHttpRequest.DONE) {
        if (target.status === 200) {
            callback(target.responseText);
        } else {
            console.log("Error: " + target.status);
        }
    } else {
        console.log("<Not yet>");
    }
};

export { requestPost, requestGet, onResponse };