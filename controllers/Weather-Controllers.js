const axios = require('axios');
const Forecast = require('../models/Weather-Model');
require('dotenv').config();

const WEATHER_BIT_KEY = process.env.WEATHER_BIT_KEY;

const weatherController =  (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  const weatherBitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_BIT_KEY}&lat=${lat}&lon=${lon}`;
  let newData=[];
  axios.get(weatherBitUrl).then((data) => {
    // console.log(data.data);
    data.data.data.forEach((weatherData)=>{
      newData.push(new Forecast(weatherData.datetime,weatherData.weather.description));
    });
    res.send(newData);
  }).catch(error => {
    res.send(error.message);
  });
};

module.exports = weatherController;
