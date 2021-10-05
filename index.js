const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');

const app = express();

const topMovies = [
  {
    title: 'Romancing the stone',
    author: 'michael Douglas',
    genre: 'adventure',
  },
  {
    title: 'Food Will Hunting',
    author: 'Matt Damon',
    genre: 'drama',
  },
  {
    title: 'Avatar',
    author: 'James Cameron',
    genre: 'scfi',
  },
  {
    title: 'Transformers',
    author: 'michael Bay',
    genre: 'Action',
  },
  {
    title: 'Aliens',
    author: 'James Cameron',
    genre: 'scfi',
  },
  {
    title: 'Skulls',
    author: 'John Pogue',
    genre: 'drama',
  },
  {
    title: 'Terminator',
    author: 'James Cameron',
    genre: 'Action',
  },
  {
    title: 'Titanic',
    author: 'James Cameron',
    genre: 'drama',
  },
  {
    title: 'Glass',
    author: 'M. Night Shyamalan',
    genre: 'Action',
  },
  {
    title: 'Prometheus',
    author: 'Ridley Scott',
    genre: 'scfi',
  },
];

const users = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    mail: 'johndoel@mail.de',
  },
];

// Print data about all requests
app.use(morgan('common'));

// Parse request body
app.use(express.json());

// Make /public directory available
app.use(express.static('public'));;

// Routing for root
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

// Get all movies, movies by genre or by author
app.get('/movies', (req, res) => {
  if ('genre' in req.query) {
    res.json(topMovies.filter((movies) => movies.genre === req.query.genre));
  } else if ('author' in req.query) {
    res.json(topMovies.filter((movies) => movies.author.includes(req.query.author)));
  } else {
    res.json(topMovies);
  }
});

// Get movies by name
app.get('/movies/:title', (req, res) => {
  res.json(topMovies.find((movie) => movie.title === req.params.title));
});

// Get directors by name
app.get('/directors/:name', (req, res) => {
/* eslint-disable-next-line */
  res.json(DIRECTORS_DATABASE.find((director) => director.name === req.params.name));
});

// User registration
app.post('/users', (req, res) => {
  const newUser = req.body;
  const failed = 'You must specify a first and last name';

  if (!newUser.firstName || !newUser.mail) {
    res.status(400).send(failed);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    const success = `Thank you listed as: <br>${JSON.stringify(newUser)}`;
    res.status(201).send(success);
  }
});

// User deregistration
app.delete('/users/:id', (req, res) => {
  const deregUser = users.find((user) => user.id === req.params.id);

  if (deregUser) {
    // Insert a function that deletes the specific user
    res.status(201).send(`User with ID ${req.params.id} has been succesfully deleted.`);
  } else {
    res.status(400).send(`There is no user with ID ${req.params.id}`);
  }
});

// Change user data (one at a time)
app.put('/users/:id', (req, res) => {
  const changeUser = users.find((user) => user.id === req.params.id);

  if (changeUser && req.body.firstName) {
    changeUser.firstName = req.body.firstName;
    res.status(201).send(`User with ID ${req.params.id} has been succesfully updated and is now:<br>${JSON.stringify(changeUser)}`);
  } else if (changeUser && req.body.lastName) {
    changeUser.lastName = req.body.lastName;
    res.status(201).send(`User with ID ${req.params.id} has been succesfully updated and is now:<br>${JSON.stringify(changeUser)}`);
  } else if (changeUser && req.body.mail) {
    changeUser.mail = req.body.mail;
    res.status(201).send(`User with ID ${req.params.id} has been succesfully updated and is now:<br>${JSON.stringify(changeUser)}`);
  } else if (Object.keys(req.body).length === 0) {
    res.status(400).send('Please specify what values to be changed.');
  } else {
    res.status(400).send(`There is no user with ID ${req.params.id}`);
  }
});

// Add movie to favorites
app.post('/users/:id/favorites/:movieTitle', (req, res) => {
  const validUser = users.find((user) => user.id === req.params.id);
  const validMovie = topMovies.find((movie) => movie.title === req.params.movieTitle);

  if (validUser && validMovie) {
    // Insert a function that post a movie to the user's favorites (which sould be an object)
    res.status(201).send('Movie has been added to your favorites list.');
  } else {
    res.status(400).send('Please specify a valid user and movie to be added to the user\'s favorites list');
  }
});

// Remove movie to favorites
app.delete('/users/:id/favorites/:movieTitle', (req, res) => {
  const validUser = users.find((user) => user.id === req.params.id);
  const validMovie = topMovies.find((movie) => movie.title === req.params.movieTitle);

  if (validUser && validMovie) {
    // Insert a function that post a movie to the user's favorites (which sould be an object)
    res.status(201).send('Movie successfully deleted from your favorites list.');
  } else {
    res.status(400).send('Please specify a valid user and movie to be deleted from the user\'s favorites list');
  }
});

// Error handler
app.use((err, req, res, next) => {
  /* eslint-disable-next-line */
  console.error(err.stack);
  res.status(500).send('OH NO YOU! Broke it ');
});

app.listen(8080, () => {
  /* eslint-disable-next-line */
  console.log('Server is up and running on port 8080.');
});
