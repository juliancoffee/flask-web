const requestPost = (url, text, callback) => {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = callback;
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/json')
    httpRequest.send(text);
}

const requestGet = (url, callback) => {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = callback;
    httpRequest.open('GET', url);
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*')
    httpRequest.send()
}

const onResponse = (response, callback) => {
    let target = response.originalTarget
    if (target.readyState === XMLHttpRequest.DONE) {
        if (target.status === 200) {
            callback(target.responseText)
        } else {
            console.log("Error: " + target.status)
        }
    } else {
            console.log("<Not yet>")
    }
}

export { requestPost, requestGet, onResponse }
