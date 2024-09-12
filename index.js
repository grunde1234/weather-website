document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById('loader');
    const content = document.getElementById('container');
    const button = document.querySelector('.js-button');
    const search = document.querySelector('.js-search');
    const notFound = document.getElementById('not-found');
    const temp = document.querySelector('.js-temp');
    const weatherRetrieve = document.getElementById('weather-retrieved');
    const humidit = document.querySelector('.js-humidity-p');
    const weatherInfo = document.querySelector('.weather-info');
    const wind = document.querySelector('.wind-speed');
    const condition = document.getElementById('condition');
    const access_key = '86f0665cc34ba5188f599fe4f468f239';

    /* LOADER */
    window.addEventListener('load', function () {
        setTimeout(() => {
            loader.style.display = 'none';  // Hide the loader
            content.style.display = 'block';  // Show the main content
        }, 2000);  // Simulate a 2-second loading delay
    });

    /* BUTTON FETCH WEATHER DATA */
    button.addEventListener("click", function () {
        weatherFetched();  // Trigger weather fetch when the button is clicked
    });

    /* ENTER TO FETCH */
    search.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            weatherFetched();  // Trigger weather fetch on Enter key press
        }
    });

    /* ASYNC FUNCTION TO FETCH WEATHER DATA */
    const weatherFetched = async () => {
        if (!navigator.onLine) {
            Swal.fire({
                title: "No internet connection",
                text: "Please check your connection and try again.",
                icon: "warning"
            });
            return;  // Stop further execution if there's no internet connection
        }

        const location = search.value.trim();  // Get the location from the search input
        if (location.length === 0) {
            Swal.fire({
                title: "Location required",
                text: "Please enter a location to fetch weather data.",
                icon: "info"
            });
            return;  // Stop execution if no location is entered
        }

        const url = `https://api.weatherstack.com/current?access_key=${access_key}&query=${location}`;

        try {
            const response = await fetch(url);
            const weather = await response.json();

            // Check if the response contains valid data for the queried location
            if (weather.error || !weather.location) {
                content.style.height = '500px';
                notFound.classList.add('fade-in');
                notFound.style.display = 'block';
                temp.style.display = 'none';  // Hide temperature if not found
            } else {
                console.log(weather);  // Log weather data for debugging
                const weatherArray = convertWeatherToArray(weather.current);  // Convert weather data to array
                console.log(weatherArray);  // Log array for debugging
                displayWeather(weatherArray);  // Use the array for display
            }
        } catch (error) {
            console.log("Error:", error.message);
            Swal.fire({
                title: "Error",
                text: "Unable to fetch weather data. Please try again later.",
                icon: "error"
            });
        }
    };

    /* FUNCTION TO CONVERT WEATHER DATA TO AN ARRAY */
    function convertWeatherToArray(weather) {
        return [
            weather.temperature,  // Store temperature
            weather.humidity,     // Store humidity
            weather.wind_speed,   // Store wind speed
            weather.weather_descriptions[0]  // Store weather description (e.g., 'Sunny')
        ];
    }

    /* FUNCTION TO DISPLAY WEATHER DATA */
    function displayWeather(weatherArray) {
        const [temperature, humidity, windSpeed, description] = weatherArray;  // Destructure the array
        content.style.height = '500px';

        weatherRetrieve.classList.add('fade-in');
        weatherInfo.classList.add('fade-in');

        temp.style.display = 'block';
        temp.textContent = `${temperature}°C`;
        humidit.textContent = `${humidity}%`;
        wind.textContent = `${windSpeed} km/h`;

        // Display condition icon based on description
        switch (description) {
            case 'Sunny':
                condition.innerHTML = `<i class="fa-solid fa-sun fa-beat"></i>`;
                break;
            case 'Cloudy':
                condition.innerHTML = `<i class="fa-solid fa-cloud fa-beat"></i>`;
                break;
            case 'Rain':
                condition.innerHTML = `<i class="fa-solid fa-cloud-showers-heavy fa-beat"></i>`;
                break;
            case 'Snow':
                condition.innerHTML = `<i class="fa-solid fa-cloud-meatball fa-beat"></i>`;
                break;
            default:
                condition.innerHTML = `<i class="fa-solid fa-cloud fa-beat"></i>`;
                break;  // Default case for other weather conditions (e.g., 'Mist', 'Fog')
        }
    }
});
