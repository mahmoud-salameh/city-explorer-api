const axios = require('axios');
const Movie = require('../models/Movies-Model');
require('dotenv').config();


const Cache = require('../Helper/Cache');


const cacheObj = new Cache();


const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

const movieController = (req,res) => {
  let cityName = req.query.city;
  console.log(cityName);
  const requestKey = `movie-${cityName}`;

  if (cacheObj[requestKey] && (Date.now() - cacheObj[requestKey].timestamp < 86400000)) {
    console.log('=====================');
    console.log('From the cache Object');
    console.log('=====================');
    res.json(cacheObj[requestKey]);
  }
  else{
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${cityName}`)
      .then(response => {
        const arrOfMovies = [];
        response.data.results.map(item => {
          let imageURL = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
          let movieObject = new Movie(
            item.title,
            item.overview,
            item.vote_average,
            item.vote_count,
            imageURL,
            item.popularity,
            item.release_date
          );
          arrOfMovies.push(movieObject);
        });
        console.log('=====================');
        console.log('From the axios request');
        console.log('=====================');
        console.log('Storing the data from the request into our cache');
        console.log('=====================');
        cacheObj[requestKey] = arrOfMovies;
        cacheObj[requestKey].timestamp = Date.now();
        res.status(200).send(arrOfMovies);
      })
      .catch(error => {
        res.status(500).send(error.message);
      });
  }
};

module.exports = movieController;
