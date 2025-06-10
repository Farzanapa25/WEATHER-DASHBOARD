import React, { useState } from 'react';
import './App.css';

const API_KEY = '35fcc0016bc5a5d5c8aa1def68d0cd6e'; 

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const weatherJson = await weatherRes.json();
      if (weatherJson.cod !== 200) throw new Error(weatherJson.message);
      setWeatherData(weatherJson);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastJson = await forecastRes.json();

      const grouped = {};
      forecastJson.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!grouped[date]) {
          grouped[date] = item;
        }
      });

      const today = new Date().toISOString().split('T')[0];
      delete grouped[today];

      const next5 = Object.values(grouped).slice(0, 5);
      setForecastData(next5);
      setError('');
    } catch (err) {
      setWeatherData(null);
      setForecastData([]);
      setError('City not found or API error.');
    }
  };

  return (
    <div className="app container-fluid">
      <h2 className="header-title">🌦️ Weather Dashboard</h2>

      <div className="row">
        <div className="col-md-3 sidebar">
          <label className="form-label">Enter City Name:</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder=""
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ color: "black" }}
          />
          <button className="btn btn-primary w-100" onClick={fetchWeather}>
            Search
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>

        <div className="col-md-9 weather-section">
          {weatherData && (
            <div>
              <h4>
                {weatherData.name} ({new Date().toLocaleDateString()}){' '}
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                  alt="weather icon"
                />
              </h4>
              <p>🌡️ Temp: {weatherData.main.temp} °C</p>
              <p>💧 Humidity: {weatherData.main.humidity}%</p>
              <p>🌬️ Wind: {weatherData.wind.speed} m/s</p>
              <p>🔥 UV Index: <span className="badge bg-danger">9.49</span></p>
            </div>
          )}

          {forecastData.length > 0 && (
            <>
              <h5 className="mt-4">🔮 5-Day Forecast</h5>
              <div className="d-flex flex-wrap">
                {forecastData.map((item, index) => (
                  <div key={index} className="forecast-box me-2 mb-2">
                    <p><strong>{new Date(item.dt_txt).toLocaleDateString()}</strong></p>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt="forecast icon"
                    />
                    <p>{item.weather[0].description}</p>
                    <p>Temp: {item.main.temp} °C</p>
                    <p>Humidity: {item.main.humidity}%</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
