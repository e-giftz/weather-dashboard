var searchBtn = $('#search-button');
var searchInput = $('#search-input');
var modalDiv = $('#exampleModal');
var inputContainer = $('.input-group');

function displayModalMessage (type, message) {
    modalDiv.textContent =message;
    modalDiv.setAttribute("class", type);
}

function searchFormSubmit (event) {
    event.preventDefault();

    var userInput = searchInput.val();
    if (userInput) {
        getWeatherData(userInput);
    } else {
        console.log('high');
        modalDiv.modal('show');
        //modalDiv.modal('hide');  
    } 
    //modalDiv.modal('hide');   
}
getWeatherData

function getWeatherData(searchTerm) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchTerm + '&appid=048477df5206b679688ffe25f586ffc0';

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.main.temp)
            displayWeather(data, searchTerm);
        });

}

function displayWeather (cities, searchTerm) {

    searchTerm = searchInput.text();

    for (var i = 0; i < cities.main.temp.length; i++) {
        var cityTemp = cities.main.temp[i];  
        console.log(cityTemp)

       

        var cityWindSpeed = cities[i].wind.speed + '/' + cities[i].name; 
        console.log(cityWindSpeed)
    }
    for (var i = 0; i < cities.length; i++) {

        var cityHumidity = cities[i].main.humidity + '/' + cities[i].name; 
        console.log(cityHumidity)

        var cityWindSpeed = cities[i].wind.speed + '/' + cities[i].name; 
        console.log(cityWindSpeed)
    }
}

searchBtn.on('click', searchFormSubmit);









    
//current forecast:  https://api.openweathermap.org/data/2.5/weather?q=ottawa&appid=048477df5206b679688ffe25f586ffc0

//future forecast:  https://pro.openweathermap.org/data/2.5/forecast/hourly?q={city name}&appid={API key}
  // fetch(apiUrl)
  //.then(response => response.json())
  //.then(data => console.log(data));