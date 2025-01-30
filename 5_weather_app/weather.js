let output = document.getElementById("output");
let button = document.getElementById("btn");
let key = "KEY REMOVED FOR GITHUB DEMO";

let urlWea = "https://api.openweathermap.org/data/2.5/weather";
//?lat={lat}&lon={lon}&appid={API key}

let urlGeo = "http://api.openweathermap.org/geo/1.0/direct";
//?q={city name},{state code},{country code}&limit={limit}&appid={API key}

//Kelvin to Fahrenheit
let kToF = function(kTemp){
    return(Math.round(1.8*(kTemp-273) + 32));
};

//m/s to mph
let convertSpeed = function(metersPerSecond){
    return(Math.round(2.24*metersPerSecond));
};

//Wind Direction
let windDirection = function(d) {
    if (11.25 <= d && d < 33.75){
        return "NNE";
    } else if (33.75 <= d && d < 56.25) {
        return "NE";
    } else if (56.25 <= d && d < 78.75) {
        return "ENE";
    } else if (78.75 <= d && d < 101.25) {
        return "E";
    } else if (101.25 <= d && d < 123.75) {
        return "ESE";
    } else if (123.75 <= d && d < 146.25) {
        return "SE";
    } else if (146.25 <= d && d < 168.75) {
        return "SSE";
    } else if (168.75 <= d && d < 191.25) {
        return "S";
    } else if (191.25 <= d && d < 213.75) {
        return "SSW";
    } else if (213.75 <= d && d < 236.25) {
        return "SW";
    } else if (236.25 <= d && d < 258.75) {
        return "WSW";
    } else if (258.75 <= d && d < 281.25) {
        return "W";
    } else if (281.25 <= d && d < 303.75) {
        return "WNW";
    } else if (303.75 <= d && d < 326.25) {
        return "NW";
    } else if ( 326.25 <= d && d < 348.75) {
        return "NNW";
    } else {
        return "N";
    };
};

let targetCity = prompt("What city would you like the weather for?");
let targetState = prompt("If in the US which state? (Use only 2 letter state codes)");
let targetCountry = prompt("What country? (Use only ISO 3166 country codes)");

console.log(targetCity);
console.log(targetState);
console.log(targetCountry);

button.addEventListener("click", (e) =>{
    urlGeo += "?q=" + targetCity + "," + targetState + "," + targetCountry + "&limit=1" + "&appid=" + key;
    console.log(urlGeo);
    fetch(urlGeo).then(function(response){
        console.log("Response " + response);
        return response.json();
    }).then(function(location){
        displayLocation(location);

        let latitude = location[0].lat;
        let longitude = location[0].lon;
        console.log(latitude);
        console.log(longitude);

        urlWea += "?lat=" + latitude + "&lon=" + longitude + "&appid=" + key;
        console.log(urlWea);

        fetch(urlWea).then(function(response){
            console.log("Response " + response);
            return response.json();
        }).then(function(weather){
            displayWeather(weather);
        });
    });
});

let displayLocation = function(location){
    console.log(location);
};

let displayWeather = function(weather){
    console.log(weather);
    let city = weather.name;
    let country = weather.sys.country;
    let description = weather.weather[0].description;
    console.log(description);

    let currentTemp = weather.main.temp;
    let feelsLike = weather.main.feels_like;
    let highTemp = weather.main.temp_max;
    let lowTemp = weather.main.temp_min;
    
    let humidity = weather.main.humidity;
    let windSpeed = weather.wind.speed;
    let windGusts = weather.wind.gust;
    let windDir = weather.wind.deg;

    output = "<div id='header'><h1>Current Weather For " + city + ", " + country + "</h1>";
    output += "<h2>(" + description + ")</h2></div>";
    output += "<div id='conditions'><div id='current'><h2>Current Temp:</br><div id='temp'>" + kToF(currentTemp) + "&#8457;</div></h2></div>";
    output += "<div id='feel'><h2>Feels Like:</br><div id='temp'>" + kToF(feelsLike) + "&#8457;</div></h2></div>";
    output += "<div id='high'><h3>High Of:</br><div id='temp'>" + kToF(highTemp) + "&#8457;</div></div></h3><div id='low'><h3>Low Of:</br><div id='temp'>" + kToF(lowTemp) + "&#8457;</div></h3></div>";
    output += "<div id='humidity'><h4>Humidity:</br>" + humidity + "%</h4></div>";
    output += "<div id='wind'><h4>" + convertSpeed(windSpeed) + " mph winds<br/>from the " + windDirection(windDir) + "</h4></div></div>";

    console.log(output);

    button.innerHTML = 'Search another city';
    button.addEventListener("click", () =>{
        window.location.reload();
    });

    document.getElementById("weatherdisplay").innerHTML = output;
};




