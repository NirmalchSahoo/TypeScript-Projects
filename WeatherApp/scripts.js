"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Define API key and base URL for the OpenWeather API
const apiKey = '893bf59dd979c7efae6246bbc5eda243'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
// Get DOM elements to display weather information
const locationElement = document.getElementById('location');
const tempElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const descIconElement = document.getElementById('desc-icon');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
/**
 * Fetches weather data based on latitude and longitude using the OpenWeather API
 * @param lat - Latitude of the user's location
 * @param lon - Longitude of the user's location
 */
const getWeather = (lat, lon) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Construct the API request URL
        const response = yield fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!response.ok)
            throw new Error('Weather data not available');
        const data = yield response.json();
        // Update the weather information on the webpage
        locationElement.textContent = `${data.name}, ${data.sys.country}`;
        tempElement.textContent = `Temperature: ${data.main.temp}°C`;
        humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
        windElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
        // Update description and icon
        const description = data.weather[0].description.toLowerCase();
        descriptionElement.textContent = `Description: ${description}`;
        // Remove previous weather icon classes
        descIconElement.classList.remove('cloudy', 'clear', 'rain', 'drizzle', 'mist', 'haze');
        // Update icon and class based on weather description
        switch (description) {
            case 'clouds':
                descIconElement.classList.add('cloudy');
                descIconElement.classList.add('fa-cloud');
                break;
            case 'clear':
                descIconElement.classList.add('clear');
                descIconElement.classList.add('fa-sun');
                break;
            case 'rain':
                descIconElement.classList.add('rain');
                descIconElement.classList.add('fa-cloud-showers-heavy');
                break;
            case 'drizzle':
                descIconElement.classList.add('drizzle');
                descIconElement.classList.add('fa-cloud-drizzle');
                break;
            case 'mist':
                descIconElement.classList.add('mist');
                descIconElement.classList.add('fa-smog');
                break;
            case 'haze':
                descIconElement.classList.add('haze');
                descIconElement.classList.add('fa-sun');
                break;
            default:
                descIconElement.classList.add('fa-question');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            locationElement.textContent = `Error: ${error.message}`;
        }
        else {
            locationElement.textContent = 'An unknown error occurred';
        }
    }
});
/**
 * Gets the user's current location using the browser's geolocation API.
 * If successful, it retrieves the weather for the user's location.
 */
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getWeather(latitude, longitude);
        }, () => {
            locationElement.textContent = 'Unable to retrieve your location';
        });
    }
    else {
        locationElement.textContent = 'Geolocation is not supported by this browser';
    }
};
// Call getLocation to initiate weather fetching based on user location
getLocation();
