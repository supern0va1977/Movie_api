const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid'),

const app = express();

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

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

//error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Oh NO! you broke it now!');
});

// listen for requests
app.listen(8080, () => {
  console.log('MovieApp is up and ready for service on port 8080.');
});
