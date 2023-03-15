import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Weather({ capital }) {
    const api_key = process.env.REACT_APP_API_KEY;
    const [weather, setWeather] = useState([])
  
useEffect(() => {
    getWeather();
},)

const getWeather = async () => {
    const weatherData = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)
    setWeather({
        descp: weatherData.data.weather[0].description,
        icon: weatherData.data.weather[0].icon,
        temp: weatherData.data.main.temp,
        wind: weatherData.data.wind.speed,
    })
};

  return (
    <>
    <h2>Weather in {capital}</h2>
    <p>Temperature is {`${((((weather.temp)-273.15)*1.8)+32).toFixed(2)} F`}</p>
    {weather.icon ? <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="" /> : <></>}
    <p>{weather.descp}</p>
    <p>The wind is {weather.wind} m/s</p>

    </>
  )
}

export default Weather