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
    title: 'Movie, index of 0',
    author: 'None 0'
  },
  {
    id:'2',
    title: 'Movie, index of 1',
    author: 'None 1'
  },
  {
    id:'3',
    title: 'Movie, index of 2',
    author: 'None 2'
  },
  {
    id:'4',
    title: 'Movie, index of 3',
    author: 'None 3'
  },
  {
    id:'5',
    title: 'Movie, index of 4',
    author: 'None 4'
  },
  {
    id:'6',
    title: 'Movie, index of 5',
    author: 'None 5'
  },
  {
    id:'7',
    title: 'Movie, index of 6',
    author: 'None 6'
  },
  {
    id:'8',
    title: 'Movie, index of 7',
    author: 'None 7'
  },
  {
    id:'9',
    title: 'Movie, index of 8',
    author: 'None 8'
  },
  {
    id:'10',
    title: 'Movie, index of 9',
    author: 'None 9'
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
    const message = 'you are missing the name in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    moviesTop.push(newMovie);
    res.ststus(201).send(newMovie);
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
