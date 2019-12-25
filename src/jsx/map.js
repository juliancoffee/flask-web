import {requestPost} from "./request.js"
import {getCookie} from "./html.js"


const createMap = () => {
    let mymap = L.map('map-picture').setView([50.4547, 30.5238], 12)
    let map_picture = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy;' +
        ' <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,' +
        ' <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
        ' Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    });

    let esri_attribution = L.esri.basemapLayer('Topographic')
    map_picture.addTo(mymap)
    esri_attribution.addTo(mymap)
    return mymap
}

const displayPosition = e => {
    let Searcher = L.esri.Geocoding.geocodeService().reverse()
    Searcher.latlng(e.latlng).run((error, result) => {
        if (error) {
            return "Error"
        }
        let address = result.address.ShortLabel
        console.log("Address: " + address)
        const opinion = <Menu address={address}/>;
        ReactDOM.render(
            opinion,
            document.getElementById('menu-container')
        )
    })
}

const onMapClick = (e) => {
    displayPosition(e)
    console.log(e)
    let lat = e.latlng.lat
    let lon = e.latlng.lng
    getWeather(lat, lon)
}

const onCommentClick = (e) => {
    let address = document.getElementById("treasure-comment-address").value
    let post = document.getElementById("treasure-comment-post").value
    let rating = document.getElementById("treasure-comment-select").value
    let error = [];
    if (address === "") {
        error.push("address is empty")
    } 
    if (post === "") {
        error.push("address is empty")
    }
    if (error.length === 0) {
        let token = getCookie("token")
        let msg = {
            address: address,
            post: post,
            rating: rating,
            token: token,
        }
        requestPost('/treasure-map.html', JSON.stringify(msg))
        document.getElementById("treasure-comment-address").value = ""
        document.getElementById("treasure-comment-post").value = ""
    } else {
        alert(error)
    }
}

const getWeather = (lat, lon) => {
    let api_key = '60afa13eb0664704df59b58dcc79224d'
    let url = 'https://api.openweathermap.org/data/2.5/weather?' +
        `lat=${lat}&`+
        `lon=${lon}&`+
        `appid=${api_key}`

    console.log(url)
    fetch(url).
        then(response => response.json()).
        then(data => displayWeather(data))
}

const displayWeather = data => {
    const kelvin = 273
    const temp = Math.round(data.main.temp - kelvin)
    const address = data.name
    const wind = data.wind.speed
    const weather = <WeatherComponent address={address} temp={temp} wind={wind}/>;
    ReactDOM.render(
        weather,
        document.getElementById('weather-container')
    )
    console.log("Temperature: " + temp)
}

const WeatherComponent = (props) => {
    return (
        <div>
            <h2>Ближайшее место: {props.address}</h2>
            <h2>Температура: {props.temp}</h2>
            <h2>Скорость ветра: {props.wind} м/с</h2>
        </div>
    )
}


const Menu = (props) => {
    return (<form className="treasure-place-rate">
                <h1>
                    Отзывы
                </h1>
                <h2>
                    Местоположение
                </h2>
                <input value={props.address} type="text" name="adress" 
                        id="treasure-comment-address"></input>
                <h2>
                    Комментарий
                </h2>
                <textarea rows="5" cols="60" name="comment"
                            id="treasure-comment-post"></textarea>
                <h2>
                    Оценка места по пятибальной шкале
                </h2>
                <select name="rating" id="treasure-comment-select">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button id="treasure-comment-button" type="button" onClick={onCommentClick}>
                    Comment
                </button>
        </form>)
}

const map = () => {
    let mymap = createMap()
    const opinion = <Menu/>;
    ReactDOM.render(
        opinion,
        document.getElementById('menu-container')
    )
    ReactDOM.render(
        <WeatherComponent address="Выберите место на карте" temp="" wind=""/>,
        document.getElementById('weather-container')
    )
    mymap.on('click', onMapClick)
}

map()
