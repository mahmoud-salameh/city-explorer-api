const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT;
const cors = require('cors');

app.use(cors());


app.get('/',
  function (req, res) {
    res.send('Hello World');
  });


const weatherController = require('./controllers/Weather-Controllers');

app.get('/weather', weatherController);



const movieController = require('./controllers/Movie-Controllers');

app.get('/movies',movieController);


app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
