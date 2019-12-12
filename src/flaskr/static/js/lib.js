const makeRequest = (method, text, callback) => {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = callback;
    httpRequest.open(method, text);
    httpRequest.send();
};