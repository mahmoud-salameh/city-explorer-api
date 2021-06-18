const axios = require('axios');
const Forecast = require('../models/Weather-Model');
require('dotenv').config();

const Cache = require('../Helper/Cache');


const cacheObj = new Cache();



const WEATHER_BIT_KEY = process.env.WEATHER_BIT_KEY;

const weatherController =  (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  const requestKey = `weather-${lat}-${lon}`;

  if (cacheObj[requestKey] && (Date.now() - cacheObj[requestKey].timestamp < 86400000)) {
    console.log('=====================');
    console.log('From the cache Object');
    console.log('=====================');
    res.json(cacheObj[requestKey]);
  } else {

    const weatherBitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_BIT_KEY}&lat=${lat}&lon=${lon}`;
    let newData=[];
    axios.get(weatherBitUrl).then((data) => {
    // console.log(data.data);
      data.data.data.forEach((weatherData)=>{
        newData.push(new Forecast(weatherData.datetime,weatherData.weather.description));

        console.log('=====================');
        console.log('From the axios request');
        console.log('=====================');
        console.log('Storing the data from the request into our cache');
        console.log('=====================');
        cacheObj[requestKey] = newData;
        cacheObj[requestKey].timestamp = Date.now();
        res.send(newData);
      });

    }).catch(error => {
      res.send(error.message);
    });
  }
};

module.exports = weatherController;
