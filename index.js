const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();

// Logging middleware
app.use(morgan('common'));
// For the sending of static files
app.use(express.static('public'));
// Using body-parser
app.use(bodyParser.json());

let moviesTop = [
  {
    id:'1',
    title: 'Romancing the stone',
    year: '1977'
  },
  {
    id:'2',
    title: 'good will hunting',
    year: '1980'
  },
  {
    id:'3',
    title: 'avatar',
    year: '1985'
  },
  {
    id:'4',
    title: 'stargate',
    year: '1989'
  },
  {
    id:'5',
    title: 'alliens',
    year: '1993'
  },
  {
    id:'6',
    title: 'skulls',
    year: '1998'
  },
  {
    id:'7',
    title: 'deep6',
    year: '2000'
  },
  {
    id:'8',
    title: 'somerandommovie',
    year: '2002'
  },
  {
    id:'9',
    title: 'saving private ryan',
    year: '2007'
  },
  {
    id:'10',
    title: 'lord of the rings',
    year: '2013'
  },
];

// GET requests
app.get('/movies', (req, res) => {
  res.json(moviesTop);
});
//message to users
app.get('/', (req, res) => {
  res.send('this is test #2 of upcomming movie application that is under development');
});
//gets the data about a movie
app.get('/movies/:title', (req, res) => {
  res.json(moviesTop.find((movie) => {
    return movie.title === req.params.title
  }));
});
//adds data for a new movie
app.post('/movies', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
    const message = 'Missing movie title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    topTenMovies.push(newMovie);
    res.status(201).send(newMovie);
  }
});

//deletes a movie from the list by ID
app.delete('/movies/:id', (req, res) => {
  let movie = moviesTop.find((movie) => {
    return movie.id === req.params.id
  });

  if (movie) {
    moviesTop = moviesTop.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('movie wit the ID of ' + req.params.id + ' was deleted.');
  }
});

//update the year of a movie by its title
app.put('/movies/:title/:year', (req, res) => {
  let movie = moviesTop.find((movie) => {
    return movie.title = req.params.title
  });

  if (movie) {
    movie.year = parseInt(req.params.year);
    res.status(201).send(`Movie ${req.params.title} was assigned the year of ${req.params.year}.`);
  } else {
    res.status(404).send(`Movie wit the title ${req.params.title} was not found.`);
  }
});

//error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Oh NO! you broke it now!');
});
// listen for requests
app.listen(8080, () => {
  console.log('MovieApp is up and ready for service on port 8080.');
});
