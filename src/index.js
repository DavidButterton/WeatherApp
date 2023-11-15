function el(id) {
    return document.getElementById(id);
}

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
         renderCommentsByCity(city)
    }
})

// Event listener for the city input field to check weather on pressing enter
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkWeatherBtn.click();
    }
});

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
        currentWeather = weatherData
        //calls the function to display the weather data on user interface
        renderCityWeather(currentWeather);
    } catch (error) {
        //handles errors that may occur during the fetch process
        console.error('error fetching weather data', error)
    }
}

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
    cityHumidity.textContent = `Humidity: ${weather.main.humidity} %`

    if (toggleCelsius.checked) {
        const temperatureCelsius = Math.round(weather.main.temp);
        cityTemp.textContent = `Temperature: ${temperatureCelsius} °C`;
    }
    else if (toggleFahrenheit.checked) {
        const temperatureFahenheit = Math.round((weather.main.temp * 9 / 5) + 32);
        cityTemp.textContent = `Temperature: ${temperatureFahenheit} °F`;
    }

    renderHighLowTemp(weather);
    windSpeed.textContent = `Wind Speed: ${weather.wind.speed} m/s`;
    windDirection.textContent = `Wind Direction: ${weather.wind.deg}°`;
    // windGust.textContent = `Wind Gust: ${weather.wind.gust} m/s`;

}

// Event listeners for the toggle buttons to switch between Celsius and Fahrenheit
toggleCelsius.addEventListener('change', () => {
    if (currentWeather && toggleCelsius.checked) {
        const temperatureCelsius = Math.round(currentWeather.main.temp);
        cityTemp.textContent = `Temperature: ${temperatureCelsius} °C`;
        renderHighLowTemp(currentWeather);
    }
});

toggleFahrenheit.addEventListener('change', () => {
    if (currentWeather && toggleFahrenheit.checked) {
        const temperatureFahrenheit = Math.round((currentWeather.main.temp * 9 / 5) + 32);
        cityTemp.textContent = `Temperature: ${temperatureFahrenheit} °F`;
        renderHighLowTemp(currentWeather);
    }
});

//function added to render the high and low temp
function renderHighLowTemp(weather) {
    if (toggleCelsius.checked) {
        const highTempCelsius = Math.round(weather.main.temp_max);
        todaysHigh.textContent = `Today's High: ${highTempCelsius} °C`;
        const lowTempCelsius = Math.round(weather.main.temp_min);
        todaysLow.textContent = `Today's Low: ${lowTempCelsius} °C`;
    } else if (toggleFahrenheit.checked) {
        const highTempFahrenheit = Math.round((weather.main.temp_max * 9 / 5) + 32);
        todaysHigh.textContent = `Today's High: ${highTempFahrenheit} °F`;
        const lowTempFahrenheit = Math.round((weather.main.temp_min * 9 / 5) + 32);
        todaysLow.textContent = `Today's Low: ${lowTempFahrenheit} °F`;
    }
}

// Event listener for the comment button
commentForm.addEventListener('submit', handleComments)

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
    }
}

// Function to render the comments
function renderComments(comment) {
    const commentItem = document.createElement('li');
    commentItem.textContent = comment;

    commentList.append(commentItem);
}

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
}









// --------------
