const express = require('express');
morgan = require('morgan');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

let movies = [
  {
    title: 'Movie, index of 0',
    author: 'None 0'
  },
  {
    title: 'Movie, index of 1',
    author: 'None 1'
  },
  {
    title: 'Movie, index of 2',
    author: 'None 2'
  },
  {
    title: 'Movie, index of 3',
    author: 'None 3'
  },
  {
    title: 'Movie, index of 4',
    author: 'None 4'
  },
  {
    title: 'Movie, index of 5',
    author: 'None 5'
  },
  {
    title: 'Movie, index of 6',
    author: 'None 6'
  },
  {
    title: 'Movie, index of 7',
    author: 'None 7'
  },
  {
    title: 'Movie, index of 8',
    author: 'None 8'
  },
  {
    title: 'Movie, index of 9',
    author: 'None 9'
  },
];

// GET requests
app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/', (req, res) => {
  res.send('this is a test of upcomming movie application that is under development');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('MovieApp is up and ready for service on port 8080.');
});
