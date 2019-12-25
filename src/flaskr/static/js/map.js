import { requestPost } from "./request.js";
import { getCookie } from "./html.js";

var createMap = function createMap() {
    var mymap = L.map('map-picture').setView([50.4547, 30.5238], 12);
    var map_picture = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy;' + ' <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,' + ' <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' + ' Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    });

    var esri_attribution = L.esri.basemapLayer('Topographic');
    map_picture.addTo(mymap);
    esri_attribution.addTo(mymap);
    return mymap;
};

var displayPosition = function displayPosition(e) {
    var Searcher = L.esri.Geocoding.geocodeService().reverse();
    Searcher.latlng(e.latlng).run(function (error, result) {
        if (error) {
            return "Error";
        }
        var address = result.address.ShortLabel;
        console.log("Address: " + address);
        var opinion = React.createElement(Menu, { address: address });
        ReactDOM.render(opinion, document.getElementById('menu-container'));
    });
};

var onMapClick = function onMapClick(e) {
    displayPosition(e);
    console.log(e);
    var lat = e.latlng.lat;
    var lon = e.latlng.lng;
    getWeather(lat, lon);
};

var onCommentClick = function onCommentClick(e) {
    var address = document.getElementById("treasure-comment-address").value;
    var post = document.getElementById("treasure-comment-post").value;
    var rating = document.getElementById("treasure-comment-select").value;
    var error = [];
    if (address === "") {
        error.push("address is empty");
    }
    if (post === "") {
        error.push("address is empty");
    }
    if (error.length === 0) {
        var token = getCookie("token");
        var msg = {
            address: address,
            post: post,
            rating: rating,
            token: token
        };
        requestPost('/treasure-map.html', JSON.stringify(msg));
        document.getElementById("treasure-comment-address").value = "";
        document.getElementById("treasure-comment-post").value = "";
    } else {
        alert(error);
    }
};

var getWeather = function getWeather(lat, lon) {
    var api_key = '60afa13eb0664704df59b58dcc79224d';
    var url = 'https://api.openweathermap.org/data/2.5/weather?' + ("lat=" + lat + "&") + ("lon=" + lon + "&") + ("appid=" + api_key);

    console.log(url);
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        return displayWeather(data);
    });
};

var displayWeather = function displayWeather(data) {
    var kelvin = 273;
    var temp = Math.round(data.main.temp - kelvin);
    var address = data.name;
    var wind = data.wind.speed;
    var weather = React.createElement(WeatherComponent, { address: address, temp: temp, wind: wind });
    ReactDOM.render(weather, document.getElementById('weather-container'));
    console.log("Temperature: " + temp);
};

var WeatherComponent = function WeatherComponent(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            null,
            "\u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u043C\u0435\u0441\u0442\u043E: ",
            props.address
        ),
        React.createElement(
            "h2",
            null,
            "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: ",
            props.temp
        ),
        React.createElement(
            "h2",
            null,
            "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0432\u0435\u0442\u0440\u0430: ",
            props.wind,
            " \u043C/\u0441"
        )
    );
};

var Menu = function Menu(props) {
    return React.createElement(
        "form",
        { className: "treasure-place-rate" },
        React.createElement(
            "h1",
            null,
            "\u041E\u0442\u0437\u044B\u0432\u044B"
        ),
        React.createElement(
            "h2",
            null,
            "\u041C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435"
        ),
        React.createElement("input", { value: props.address, type: "text", name: "adress",
            id: "treasure-comment-address" }),
        React.createElement(
            "h2",
            null,
            "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439"
        ),
        React.createElement("textarea", { rows: "5", cols: "60", name: "comment",
            id: "treasure-comment-post" }),
        React.createElement(
            "h2",
            null,
            "\u041E\u0446\u0435\u043D\u043A\u0430 \u043C\u0435\u0441\u0442\u0430 \u043F\u043E \u043F\u044F\u0442\u0438\u0431\u0430\u043B\u044C\u043D\u043E\u0439 \u0448\u043A\u0430\u043B\u0435"
        ),
        React.createElement(
            "select",
            { name: "rating", id: "treasure-comment-select" },
            React.createElement(
                "option",
                { value: "1" },
                "1"
            ),
            React.createElement(
                "option",
                { value: "2" },
                "2"
            ),
            React.createElement(
                "option",
                { value: "3" },
                "3"
            ),
            React.createElement(
                "option",
                { value: "4" },
                "4"
            ),
            React.createElement(
                "option",
                { value: "5" },
                "5"
            )
        ),
        React.createElement(
            "button",
            { id: "treasure-comment-button", type: "button", onClick: onCommentClick },
            "Comment"
        )
    );
};

var map = function map() {
    var mymap = createMap();
    var opinion = React.createElement(Menu, null);
    ReactDOM.render(opinion, document.getElementById('menu-container'));
    ReactDOM.render(React.createElement(WeatherComponent, { address: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043C\u0435\u0441\u0442\u043E \u043D\u0430 \u043A\u0430\u0440\u0442\u0435", temp: "", wind: "" }), document.getElementById('weather-container'));
    mymap.on('click', onMapClick);
};

map();