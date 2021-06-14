const express = require('express');
const app = express();
const {data} = require('./data/weather.json');
require('dotenv').config();

const PORT = process.env.PORT;
const cors = require('cors');

app.use(cors());

class Forecast {
  constructor(date, desc) {
    this.date = date;
    this.desc = desc;
  }
}


app.get('/weather', (req, res) => {
  const newData = [];
  data.forEach((weatherData)=>{
    newData.push(new Forecast(weatherData.datetime,weatherData.weather.description));
  });
  res.json(newData);
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
