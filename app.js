const apiKey = '9186047251b0a0a29dcc361fba796082'; // User's OpenWeatherMap API key
const weatherCard = document.getElementById('weatherCard');
const weatherInfo = document.getElementById('weatherInfo');
const weatherIcon = document.getElementById('weatherIcon');
const errorMsg = document.getElementById('errorMsg');
const form = document.getElementById('locationForm');
const input = document.getElementById('locationInput');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const location = input.value.trim();
  if (!location) return;
  showLoading();
  try {
    const data = await fetchWeather(location);
    displayWeather(data);
  } catch (err) {
    showError('Could not fetch weather. Try another location.');
  }
});

async function fetchWeather(location) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
  );
  if (!res.ok) throw new Error('Weather not found');
  return res.json();
}

function setWeatherBackground(main) {
  let bg;
  switch(main.toLowerCase()) {
    case 'clear': bg = 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'; break;
    case 'clouds': bg = 'linear-gradient(135deg, #757f9a 0%, #d7dde8 100%)'; break;
    case 'rain': bg = 'linear-gradient(135deg, #667db6 0%, #0082c8 100%)'; break;
    case 'snow': bg = 'linear-gradient(135deg, #e6dada 0%, #274046 100%)'; break;
    case 'thunderstorm': bg = 'linear-gradient(135deg, #232526 0%, #414345 100%)'; break;
    case 'drizzle': bg = 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'; break;
    case 'mist':
    case 'fog': bg = 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)'; break;
    default: bg = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
  }
  document.body.style.background = bg;
}

function displayWeather(data) {
  errorMsg.textContent = '';
  weatherCard.classList.remove('hidden');
  setWeatherBackground(data.weather[0].main);
  weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon"/>`;
  weatherInfo.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
    <p>🌡️ ${data.main.temp}°C (feels like ${data.main.feels_like}°C)</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
    <p>🌅 Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
    <p>🌇 Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
    <p>🔎 Visibility: ${(data.visibility / 1000).toFixed(1)} km</p>
    <p>📈 Pressure: ${data.main.pressure} hPa</p>
  `;
}

function showLoading() {
  errorMsg.textContent = '';
  weatherCard.classList.remove('hidden');
  weatherIcon.innerHTML = '⏳';
  weatherInfo.innerHTML = 'Loading...';
}

function showError(msg) {
  weatherCard.classList.add('hidden');
  errorMsg.textContent = msg;
}

// Optionally, auto-detect location on load
window.onload = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      showLoading();
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();
        displayWeather(data);
      } catch {
        showError('Could not fetch weather for your location.');
      }
    });
  }
}; 