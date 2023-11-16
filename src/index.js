//function to import global elements
function el(id) {
    return document.getElementById(id);
};

// Constants used for API key and URLs.
const APIKey = "3db0d220d82f76e1b9db1bcdc4808baf";
const APIUrlMetric = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=Portland";
const APIurlImperial = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";

//Global elements used in the app
const checkWeatherBtn = el("searchButton");
const cityInput = el('cityInput');
const cityName = el('weatherLocation');
const weatherIcon = el('weatherIcon');
const cityTemp = el('weatherTemperature');
const cityHumidity = el('weatherHumidity');
const toggleCelsius = el('celsius');
const toggleFahrenheit = el('fahrenheit');
const commentInput = el('comment-input');
const commentBtn = el('submitcomment');
const commentList = el('comments-list')
const commentForm = el('comment-form')
const windSpeed = el('WindSpeed');
const windDirection = el('WindDirection');
// const windGust = el('windGust');
const todaysHigh = el('high');
const todaysLow = el('low');
const weatherDesc = el('weatherDescription');


//variable used to store the current weather data
let currentWeather;

//object used to store commentts based on city names
let commentsByCity = {};

// Event listener for the check weather button 
checkWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city.trim() !== '') {
        fetchWeatherData(city);
        //render comments for selected city when checking weather
        renderCommentsByCity(city);
    };
});

// Event listener for the city input field to check weather on pressing enter
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkWeatherBtn.click();
    };
});

// Event listeners for the toggle buttons to switch between Celsius and Fahrenheit
toggleCelsius.addEventListener('change', () => {
    if (currentWeather && toggleCelsius.checked) {
        cityTemp.textContent = `Temperature: ${convertTemperature('metric', currentWeather.main.temp)}`;
        renderHighLowTemp(currentWeather);
    };
});

toggleFahrenheit.addEventListener('change', () => {
    if (currentWeather && toggleFahrenheit.checked) {
        cityTemp.textContent = `Temperature: ${convertTemperature('imperial', currentWeather.main.temp)}`;
        renderHighLowTemp(currentWeather);
    };
});

// Event listener for the comment button
commentForm.addEventListener('submit', handleComments);

// declares an asynchronous Function to fetch weather data for the city
async function fetchWeatherData(city) {
    //constructs the API URL for weather data by city and API Key
    const APIUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${APIKey}`;
    //try block handles contains and handles asynchronous statements
    try {
        //make an asynchronous fetch request to OpenWeatherMap API
        const response = await fetch(APIUrl);
        // analyzes the JSON response from API
        const weatherData = await response.json();
        //updates the global variable currentWeather with the fetched data
        currentWeather = weatherData;
        //calls the function to display the weather data on user interface
        renderCityWeather(currentWeather);
    } catch (error) {
        //handles errors that may occur during the fetch process
        console.error('error fetching weather data', error);
    };
};

fetchWeatherData('Portland');

// Fetch initial weather data for Portland. Metric constant above
fetch(APIUrlMetric + `&appid=${APIKey}`)
    .then(res => res.json())
    .then(renderCityWeather)

// Function to render the weather data for the city
function renderCityWeather(weather) {
    cityName.textContent = weather.name;
    const iconURl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
    weatherIcon.src = iconURl;
    weatherDesc.textContent = `${weather.weather[0].description}`;
    cityHumidity.textContent = `Humidity: ${weather.main.humidity} %`;
    const unit = toggleCelsius.checked ? 'metric' : 'imperial';
    cityTemp.textContent = `Temperature: ${convertTemperature(unit, weather.main.temp)}`;
    renderHighLowTemp(weather);
    windSpeed.textContent = `Wind: ${getWindDirection(weather.wind.deg)} ${weather.wind.speed} m/s`;
};

//function added to render the high and low temp
function renderHighLowTemp(weather) {
    const unit = toggleCelsius.checked ? 'metric' : 'imperial';

    const highTemp = convertTemperature(unit, weather.main.temp_max);
    todaysHigh.textContent = `Today's High: ${highTemp}`;

    const lowTemp = convertTemperature(unit, weather.main.temp_min);
    todaysLow.textContent = `today's Low: ${lowTemp}`
};

//function to convert Temperature and return the unit
function convertTemperature(unit, temperature) {
    return unit === 'metric' ? `${Math.round(temperature)} ° C` : `${Math.round(temperature * 9 / 5) + 32} °F`;
};

function getWindDirection(degrees) {
    if (degrees >= 338 || degrees < 23) return 'N';
    if (degrees >= 23 && degrees < 68) return 'NE';
    if (degrees >= 68 && degrees < 113) return 'E';
    if (degrees >= 113 && degrees < 158) return 'SE';
    if (degrees >= 158 && degrees < 203) return 'S';
    if (degrees >= 203 && degrees < 248) return 'SW';
    if (degrees >= 248 && degrees < 293) return 'W';
    if (degrees >= 293 && degrees < 338) return 'NW';
};

// Function to handle the comments
function handleComments(event) {
    event.preventDefault();
    const commentText = commentInput.value;
    const selectedCity = currentWeather ? currentWeather.name : 'Default';
    if (commentText) {
        // check if comments exist for selected city, if not create array
        commentsByCity[selectedCity] = commentsByCity[selectedCity] || [];
        // add the comment to the array with the selected city
        commentsByCity[selectedCity].push(commentText);
        renderComments(commentText);
        event.target.reset();
    };
};

// Function to render the comments
function renderComments(comment) {
    const commentItem = document.createElement('li');
    commentItem.textContent = comment;

    commentList.append(commentItem);
};

//function to render tha comments for selected city
function renderCommentsByCity(selectedCity) {
    //clear the current comments
    commentList.innerHTML = '';
    //create a variable to retrieve comments for selected city
    const cityComments = commentsByCity[selectedCity] || [];
    //render comments for selected city
    cityComments.forEach(comment => {
        renderComments(comment);
    });
};









// --------------