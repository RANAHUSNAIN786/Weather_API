

const input = document.getElementById("aa");
const API_KEY = "6469452c0ec87bf182525d3f3a2a9de0";

input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getdetails();
  }
});

function getdetails() {
  const cityname = input.value.trim();
  if (!cityname) return alert("Please enter a city name");

  const tempDisplay = document.querySelector(".temperature");
  const locationDisplay = document.querySelector(".location");
  const humidityDisplay = document.getElementById("bb");
  const windDisplay = document.getElementById("cc");

  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&units=metric`;

  fetch(URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error("City not found");
      }
      return res.json();
    })
    .then((data) => {
      tempDisplay.textContent = `${Math.round(data.main.temp)}°C`;
      locationDisplay.textContent = data.name;
      humidityDisplay.textContent = `${data.main.humidity}%`;
      windDisplay.textContent = `${data.wind.speed} km/h`;
    })
    .catch((error) => {
      alert("City not found. Please try again.");
    });
}
