var searchTerm = "";
var searchBtn = $('#search-button');
var searchInput = $('#search-input');
var currentCityName = $('#current-city-name');
var currentCityTemp = $('#temp');
var currentCityHumidity = $('#humidity');
var currentCityWSpeed = $('#wind-speed');
var currentCityUV = $('#uv-index');
var modalDiv = $('#exampleModal');
var inputContainer = $('.input-group');
var savedCityName = [];


function displayModalMessage (type, message) {
    modalDiv.textContent =message;
    modalDiv.setAttribute("class", type);
}

function searchFormSubmit (event) {
    event.preventDefault();

    if (searchInput.val()!== "") {
        searchTerm = searchInput.val().trim();
        if (searchTerm) {
            getWeatherData(searchTerm);
        } else {
            modalDiv.modal('show');

            $(".btn").click(function(){
                modalDiv.modal('hide');
            }); 
        } 
    }
    
}

function getWeatherData(city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=048477df5206b679688ffe25f586ffc0';

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayWeather(data);
        });

}

function displayWeather(cityname) {
    console.log(cityname)
    var currentDate = moment().format("M/DD/YYYY");
    // Variables to store details 
    var currentIconImg = cityname.weather[0].icon;
    var currentIconUrl = "https://openweathermap.org/img/wn/"+ currentIconImg +"@2x.png";
    var city = cityname.name; 
    currentCityName.html(city + " " + "("+currentDate+")" + "<img src="+currentIconUrl+">");
    var cityTemp = cityname.main.temp;  
    $(currentCityTemp).html(" "+ cityTemp + "&#8457");
    var cityWindSpeed = cityname.wind.speed; 
    $(currentCityWSpeed).html(" " + cityWindSpeed + "MPH");
    var cityHumidity = cityname.main.humidity; 
    $(currentCityHumidity).html(" " + cityHumidity + "%");

    weatherForecast(cityname.coord.lat, cityname.coord.lon);
    displayUVIndex(cityname.coord.lat, cityname.coord.lon);

    // Set conditions  to save valid city entry
    if (cityname.cod==200){
        savedCityName=JSON.parse(localStorage.getItem('searchCity'));
        console.log(savedCityName)
        if(savedCityName==null){
            savedCityName=[];
            savedCityName.push(searchTerm.toUpperCase());
            localStorage.setItem('searchCity', JSON.stringify(savedCityName));
            addToSearchList(searchTerm);
        }else {
            savedCityName.push(searchTerm.toUpperCase());
            localStorage.setItem('searchCity', JSON.stringify(savedCityName));
            addToSearchList(searchTerm);
        }
        
    }

}

function weatherForecast(latd, longd) {
    var apiForecastUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' +latd+'&lon='+longd+'&exclude=current,minutely,hourly,alerts&units=imperial&appid=048477df5206b679688ffe25f586ffc0';

    fetch(apiForecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            
            for (var i=0;i<data.daily.length;i++){;
                var today = moment();
                var tomorrow = today.add(i+1,'days');
                var futureDate = moment(tomorrow).format("M/DD/YYYY");
                var iconImg =  data.daily[i].weather[0].icon
                var iconUrl = "https://openweathermap.org/img/wn/"+iconImg+".png";
                var tempForecast = data.daily[i].temp.day;
                var humidityForecast = data.daily[i].humidity;   
                // Displaying future weather forecast on the page
                $("#futureD"+i).html(" "+futureDate);
                $("#futureImg"+i).html("<img src="+iconUrl+">");
                $("#futureTemp"+i).html(" "+tempForecast+"&#8457");
                $("#futureHumidity"+i).html(" "+humidityForecast+"%");
            }
        });

        
}

function displayUVIndex(lat, long) {
    var apiUVUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' +lat+'&lon='+long+'&exclude=minutely,hourly,daily,alerts&units=imperial&appid=048477df5206b679688ffe25f586ffc0';

    fetch(apiUVUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            $(currentCityUV).html(data.current.uvi)
        })
}

function addToSearchList(inputData) {
    var listItemEl = $("<li>"+inputData+"</li>");
    $(listItemEl).attr("class", "list-group-item");
    $(listItemEl).css("cursor", "pointer");
    $(".list-group").append(listItemEl);
}

function displayHistoryCity(event) {
    var liEl = event.target;
    if (liEl.matches("li")) {
        searchTerm = liEl.textContent.trim();
        getWeatherData(searchTerm);
    }
}

function displayLastCity() {
    $("ul").empty();
    var savedCityName = JSON.parse(localStorage.getItem("searchCity"));
    if(savedCityName!==null){
        savedCityName=JSON.parse(localStorage.getItem("searchCity"));
        for(var i=0; i<savedCityName.length;i++) {
            addToSearchList(savedCityName[i]);
        }
        searchTerm=savedCityName[i-1];
        getWeatherData(searchTerm);
    }
}

$(document).on('click', displayHistoryCity);
searchBtn.on('click', searchFormSubmit);
$(window).on('load', displayLastCity);
