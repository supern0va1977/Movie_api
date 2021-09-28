cconst express = require('express');
const app = express();

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
app.get('/', (req, res) => {
  res.send('Welcome to my book club!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/books', (req, res) => {
  res.json(topBooks);
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
