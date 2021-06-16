const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT;
const WEATHER_BIT_KEY = process.env.WEATHER_BIT_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const cors = require('cors');

app.use(cors());

class Forecast {
  constructor(date, desc) {
    this.date = date;
    this.desc = desc;
  }
}

app.get('/',
  function (req, res) {
    res.send('Hello World');
  });

app.get('/weather', (req, res) => {
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


});

class Movie {
  constructor(title, overview, averageVotes, totalVotes, imgUrl, popularity, releasedOn){
    this.title = title;
    this.overview = overview;
    this.average_votes = averageVotes;
    this.total_votes = totalVotes;
    this.image_url = imgUrl;
    this.popularity = popularity;
    this.released_on = releasedOn;
  }
}

app.get('/movies',(req,res) => {
  let cityName = req.query.city;
  console.log(cityName);
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${cityName}`)
    .then(response => {
      const arrOfMovies = [];
      response.data.results.map(item => {
        let imageURL = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        let movieObject = new Movie(item.title, item.overview, item.vote_average, item.vote_count, imageURL, item.popularity, item.release_date);
        arrOfMovies.push(movieObject);
      });
      res.status(200).send(arrOfMovies);
    })
    .catch(error => {
      res.status(500).send(error.message);
    });
}
);


app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
