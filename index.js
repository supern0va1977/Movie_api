const express = require('express');
const morgan = require("morgan");
const bodyParser = require('body-parser');
// const uuid = require('uuid');

const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//conntecting database with connection URI
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//activating body-parser
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//calling express
app.use(express.json());

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

app.use(myLogger);
app.use(morgan('common'));

  // Welcome message
app.get('/', (req, res) => {
  res.send('Welcome this site is under construction, this is to let you know i am here ');
});

  //get list of all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET requests for a specific movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ', err);
  });
});

    //get a specific genre by name
app.get('/genres/:Name', (req, res) => {
  Movies.findOne({ "Genre.Name" : req.params.Name})
  .then((movie) => {
    res.json(movie.Genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get director info by name
app.get('/directors/:Name', (req, res) => {
  Movies.findOne({ "Director.Name" : req.params.Name})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


  //get all users
app.get('/users', function (req, res) {
  Users.find()
  .then(function (users) {
    res.status(201).json(users);
  })
  .catch(function (err) {
    console.error(err);
    res.status(500).send('Error:' + err);
  });
});

//adding a new user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

  // Update user info by username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate(
    {Username: req.params.Username},
    {
    $set: {
      Name: req.body.Name,
      Password: req.body.Password,
      Mail: req.body.Mail,
      Birthday: req.body.Birthday
    },
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
Users.findOneAndUpdate({Username: req.params.Username},
  {
    $push: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete a user by their username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
  .then((user) => {
    if(!user) {
      res.status(400).send(req.params.Username + ' was not found.');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

  // Delete a movie from the favorite list of an user
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $pull: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

   // Error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('OH NO YOU BROKE IT !');
});

  // listen for requests
app.listen(8080, () => {
  console.log('Your app is up and running on port 8080.');
});
