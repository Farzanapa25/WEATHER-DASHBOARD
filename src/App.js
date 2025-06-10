import React, { useState } from 'react';
import './App.css';

const API_KEY = "35fcc0016bc5a5d5c8aa1def68d0cd6e";

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) {
      setError("⚠️ Please enter a city");
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        setError('');
      } else {
        setError('❌ City not found');
        setWeather(null);
      }
    } catch {
      setError('⚠️ Error fetching data');
      setWeather(null);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">🌦️ Weather Dashboard</h1>
        <input
          type="text"
          placeholder="🔍 Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Get Weather</button>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-info">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />
            <h2>{weather.name}, {weather.sys.country}</h2>
            <p className="desc">{weather.weather[0].main} - {weather.weather[0].description}</p>
            <div className="info">
              <p>🌡️ Temperature: <strong>{weather.main.temp}°C</strong></p>
              <p>💧 Humidity: <strong>{weather.main.humidity}%</strong></p>
              <p>💨 Wind: <strong>{weather.wind.speed} m/s</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
