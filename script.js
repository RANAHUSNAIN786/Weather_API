 const API_KEY = "6469452c0ec87bf182525d3f3a2a9de0";
    const input = document.getElementById("aa");
    const status = document.getElementById("status");
    const weatherIcon = document.getElementById("weatherIcon");
    const temperature = document.getElementById("temperature");
    const locationDisplay = document.getElementById("location");
    const description = document.getElementById("description");
    const humidityDisplay = document.getElementById("bb");
    const windDisplay = document.getElementById("cc");
    const feelsLikeDisplay = document.getElementById("dd");
    const pressureDisplay = document.getElementById("gg");
    const sunriseDisplay = document.getElementById("ee");
    const sunsetDisplay = document.getElementById("ff");
    const forecast = document.getElementById("forecast");

    // Handle Enter key press
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        getdetails();
      }
    });

    // Toggle light/dark mode
    function toggleTheme() {
      document.body.classList.toggle("light-mode");
      document.querySelector(".weather-app").classList.toggle("light-mode");
      const themeButton = document.querySelector(".theme-toggle");
      themeButton.textContent = document.body.classList.contains("light-mode") ? "🌙" : "☀️";
      themeButton.style.transform = "rotate(0deg)"; // Reset rotation after toggle
    }

    // Show loading state with skeleton
    function showLoading() {
      status.innerHTML = `<p class="loading">⏳ Loading...</p>`;
      [weatherIcon, temperature, locationDisplay, description, humidityDisplay, windDisplay, feelsLikeDisplay, pressureDisplay, sunriseDisplay, sunsetDisplay].forEach(el => {
        el.classList.add("skeleton");
        el.style.pointerEvents = "none";
      });
      forecast.innerHTML = `
        <div class="forecast-box skeleton"><h2 class="skeleton-text"></h2><div class="weather-icon skeleton-icon"></div><h3 class="skeleton-text"></h3></div>
        <div class="forecast-box skeleton"><h2 class="skeleton-text"></h2><div class="weather-icon skeleton-icon"></div><h3 class="skeleton-text"></h3></div>
        <div class="forecast-box skeleton"><h2 class="skeleton-text"></h2><div class="weather-icon skeleton-icon"></div><h3 class="skeleton-text"></h3></div>
      `;
    }

    // Hide loading state
    function hideLoading() {
      status.innerHTML = "";
      [weatherIcon, temperature, locationDisplay, description, humidityDisplay, windDisplay, feelsLikeDisplay, pressureDisplay, sunriseDisplay, sunsetDisplay].forEach(el => {
        el.classList.remove("skeleton");
        el.style.pointerEvents = "auto";
      });
    }

    // Show error message
    function showError(message) {
      status.innerHTML = `<p class="error">❌ ${message}</p>`;
      hideLoading();
      forecast.innerHTML = "";
    }

    // Map weather condition to icon
    function getWeatherIcon(iconCode) {
      return `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="weather icon" style="width: 80px;" />`;
    }

    // Format time from timestamp
    function formatTime(timestamp, timezone) {
      const date = new Date((timestamp + timezone) * 1000);
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
    }

    // Fetch weather data
    async function getdetails() {
      const cityname = input.value.trim();
      if (!cityname) {
        showError("Please enter a city name");
        return;
      }

      showLoading();

      try {
        // Current weather
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&units=metric`;
        const weatherResponse = await fetch(weatherURL);
        if (!weatherResponse.ok) {
          throw new Error("City not found");
        }
        const weatherData = await weatherResponse.json();

        // Forecast
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${API_KEY}&units=metric`;
        const forecastResponse = await fetch(forecastURL);
        if (!forecastResponse.ok) {
          throw new Error("Forecast data not available");
        }
        const forecastData = await forecastResponse.json();

        // Update current weather
        weatherIcon.innerHTML = getWeatherIcon(weatherData.weather[0].icon);
        temperature.textContent = `${Math.round(weatherData.main.temp)}°C`;
        locationDisplay.textContent = weatherData.name;
        description.textContent = weatherData.weather[0].description;
        humidityDisplay.textContent = `${weatherData.main.humidity}%`;
        windDisplay.textContent = `${weatherData.wind.speed} km/h`;
        feelsLikeDisplay.textContent = `${Math.round(weatherData.main.feels_like)}°C`;
        pressureDisplay.textContent = `${weatherData.main.pressure} hPa`;
        sunriseDisplay.textContent = formatTime(weatherData.sys.sunrise, weatherData.timezone);
        sunsetDisplay.textContent = formatTime(weatherData.sys.sunset, weatherData.timezone);

        // Update forecast (next 3 days, taking one data point per day at noon)
        forecast.innerHTML = "";
        const dailyForecasts = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 3);
          dailyForecasts.forEach(item => {
          const date = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
             forecast.innerHTML += `
            <div class="forecast-box">
              <h2>${date}</h2>
              <div class="weather-icon">${getWeatherIcon(item.weather[0].icon)}</div>
              <h3>${Math.round(item.main.temp)}°C</h3>
            </div>
          `;
         });

        hideLoading();
      } catch (error) {
          showError(error.message === "City not found" ? "City not found. Please try again." : "Network error. Please try again later.");
      }
    }