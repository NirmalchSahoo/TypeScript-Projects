// Define API key and base URL for the OpenWeather API
const apiKey: string = '893bf59dd979c7efae6246bbc5eda243'; // Replace with your OpenWeatherMap API key
const apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

// Get DOM elements to display weather information
const locationElement: HTMLElement = document.getElementById('location')!;
const tempElement: HTMLElement = document.getElementById('temperature')!;
const descriptionElement: HTMLElement = document.getElementById('description')!;
const descIconElement: HTMLElement = document.getElementById('desc-icon')!;
const humidityElement: HTMLElement = document.getElementById('humidity')!;
const windElement: HTMLElement = document.getElementById('wind')!;

/**
 * Fetches weather data based on latitude and longitude using the OpenWeather API
 * @param lat - Latitude of the user's location
 * @param lon - Longitude of the user's location
 */
const getWeather = async (lat: number, lon: number): Promise<void> => {
    try {
        // Construct the API request URL
        const response = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

        if (!response.ok) throw new Error('Weather data not available');

        const data = await response.json();

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
        
    } catch (error) {
        if (error instanceof Error) {
            locationElement.textContent = `Error: ${error.message}`;
        } else {
            locationElement.textContent = 'An unknown error occurred';
        }
    }
};

/**
 * Gets the user's current location using the browser's geolocation API.
 * If successful, it retrieves the weather for the user's location.
 */
const getLocation = (): void => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            getWeather(latitude, longitude);
        }, () => {
            locationElement.textContent = 'Unable to retrieve your location';
        });
    } else {
        locationElement.textContent = 'Geolocation is not supported by this browser';
    }
};

// Call getLocation to initiate weather fetching based on user location
getLocation();
