
const searchInput = document.querySelector ("#findInput");
const myRow = document.querySelector ("#weather-row");
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["1January", "2February", "3March", "4April", "5May", "6June", "7July", "8August", "9September", "10October", "11November", "12December"];

function getLocation() {
    console.log("in getlocation");
    if (navigator.geolocation) {
        console.log("in getlocation true");
        navigator.geolocation.getCurrentPosition(showPosition , showError);
    } else { 
        console.log("getlocation false");
        search("cairo");
    }
}

function showPosition(position) {
    search(position.coords.latitude,position.coords.longitude);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            search("cairo");
        break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            search("cairo");
        break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            search("cairo");
        break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            search("cairo");
        break;
    }
}

getLocation();

searchInput.addEventListener("keyup", e => {
    search(e.target.value)
} );

async function search(input,input2 = "") {
    let res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a21ad3a646314f63a53121132241212&q=${input+","+input2}&days=3`);
    if (res.ok && 400 != res.status) {
        let data = await res.json();
        console.log(data);
        displayCurrent(data.location, data.current);
        displayAnother(data.forecast.forecastday);
    }
}

function displayCurrent(place, weather ) {
    if (weather != null) {
        let x = new Date(weather.last_updated);
        let today = `<div class="col-lg primary-body" id="today">
                        <div class="table-head d-flex justify-content-between primary-head p-2 fs-14">
                            <div id="day">
                                ${days[x.getDay()]}
                            </div>
                            <div id="date">
                                ${monthNames[x.getMonth()]}
                            </div>
                        </div>
                        <div id="body" class=" px-3 py-4">
                            <div id="place" class="fs-5">
                                ${place.name}
                            </div>
                            <div id="weather">
                                <div class="d-inline-block">
                                    ${weather.temp_c}<sup>o</sup>C
                                </div>
                                <img  src="https:${weather.condition.icon}" alt="Image Describe Weather">
                            </div>
                            <div id="weather-describetion" class="my-3 fs-14">
                                ${weather.condition.text}
                            </div>
                            <span>
                                <img src="image/icon-umberella.png" alt="umberella icon">
                                20%
                            </span>
                            <span>
                                <img src="image/icon-wind.png" alt="wind icon">
                                18km/h
                            </span>
                            <span>
                                <img src="image/icon-compass.png" alt="compass icon">
                                East
                            </span>
                        </div>
                    </div>`
        myRow.innerHTML = today;
    }
}

function displayAnother(forecastDay) {
    let cartona = "";
    for (let i = 1; i < forecastDay.length; i++) {
        let x = new Date(forecastDay[i].date);
        cartona += `<div class="col-lg secondery-body" id="next-day">
                        <div class="table-head d-flex justify-content-center secondery-head p-2 fs-14" >
                            <div id="day">
                                ${days[x.getDay()]}
                            </div>
                        </div>
                        <div id="body" class=" text-center py-5">
                            <div class="mb-3">
                                <img id="weather-img" src="https:${forecastDay[i].day.condition.icon}" alt="Image Describe Weather">
                            </div>
                            <div id="weather">
                                ${forecastDay[i].day.maxtemp_c}<sup>o</sup>C
                            </div>
                            <small>
                                ${forecastDay[i].day.mintemp_c}<sup>o</sup>
                            </small>
                            <div class="my-3" id="weather-describetion">
                                ${forecastDay[i].day.condition.text}
                            </div>
                        </div>
                    </div> `; 
    }
    myRow.innerHTML += cartona;
}