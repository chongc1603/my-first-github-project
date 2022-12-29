let apiKey = "11dd0fd4b3ac75eb75e9eb8f78c5fe37";

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDate = new Date();
let timeHour = currentDate
  .getHours()
  .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
let timeMinute = currentDate
  .getMinutes()
  .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
let dateString = `${days[currentDate.getDay()]} ${timeHour}:${timeMinute}`;

let tempUnit = "metric";

let cityInput = document.querySelector("#city-input");
let cityDisplay = document.querySelector("#city");
let dateElement = document.querySelector("#current-date");
let searchButton = document.querySelector("#searchButton");
let currentButton = document.querySelector("#currentButton");
let celsiusLink = document.querySelector("#celsius");
let fahrenheitLink = document.querySelector("#fahrenheit");

function showWeather(response) {
  let temp = document.querySelector("#temperature");
  let weatherDisplay = document.querySelector("#current-weather");
  let humidityDisplay = document.querySelector("#humidity");
  let windDisplay = document.querySelector("#wind");
  let dateDisplay = document.querySelector("#current-date");

  let timezone = response.data.timezone;
  let timezoneInMinutes = timezone / 60;
  let currentTime = moment()
    .utcOffset(timezoneInMinutes)
    .format("dddd hh:mm A");
  let currentTemp = Math.round(response.data.main.temp);
  let weatherDescription = response.data.weather[0].main;
  let humidity = Math.round(response.data.main.humidity);
  let windSpeed = response.data.wind.speed;

  cityDisplay.innerHTML = response.data.name;
  temp.innerHTML = currentTemp;
  weatherDisplay.innerHTML = weatherDescription;
  humidityDisplay.innerHTML = `Humidity: ${humidity}%`;
  windDisplay.innerHTML = `Wind: ${windSpeed} km/h`;
  dateDisplay.innerHTML = currentTime;
  tempUnit = "metric";
}

function searchCity(event) {
  event.preventDefault();
  let unit = "metric";
  let citySearch = cityInput.value;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showWeather);
}

function searchLocation(position) {
  let unit = "metric";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showWeather);
}

function searchCoordinates() {
  cityInput.value = "";
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function convertToCelsius(temperature) {
  return Math.round(((temperature - 32) * 5) / 9);
}

function convertToFahrenheit(temperature) {
  return Math.round((temperature * 9) / 5 + 32);
}

function convertTemp(event) {
  let tempDisplay = document.querySelector("#temperature");
  let temp = tempDisplay.innerHTML;
  let convertedTemp = temp;

  if (this.id === "celsius" && tempUnit === "imperial") {
    convertedTemp = convertToCelsius(temp);
    tempDisplay.innerHTML = convertedTemp;
    tempUnit = "metric";
  }
  if (this.id === "fahrenheit" && tempUnit === "metric") {
    convertedTemp = convertToFahrenheit(temp);
    tempDisplay.innerHTML = convertedTemp;
    tempUnit = "imperial";
  }
}

dateElement.innerHTML = dateString;

searchButton.addEventListener("click", searchCity);
currentButton.addEventListener("click", searchCoordinates);
celsiusLink.addEventListener("click", convertTemp);
fahrenheitLink.addEventListener("click", convertTemp);

searchCoordinates();
