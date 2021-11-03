const express = require('express');
const morgan = require("morgan");
const bodyParser = require('body-parser');
// const uuid = require('uuid');
const { check, validationResult } = require('express-validator');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//including CORS that allows all domain
const cors = require('cors');
app.use(cors());
/* ALLOW CERTAIN DOMAIN ONLY */

// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));

//conntecting database with connection URI
//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//middle ware  //activating body-parser //calls for passport and authorization
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//calling express
app.use(express.json());
//calls public folder
app.use(express.static("public"));

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
app.get('/movies', passport.authenticate('jwt', { session: false }),(req, res) => {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }),(req, res) => {
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
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }),(req, res) => {
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
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }),(req, res) => {
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
app.get('/users', passport.authenticate('jwt', { session: false }),function (req, res) {
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

app.post('/users',
    [ //validator entries
        check('Username', 'Username is required, must be at least 5 characters').isLength({min: 5}),
        check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email is invalid').isEmail()
    ], (req, res) => {
    //check validation
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({Username: req.body.Username})
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + ' is already registered');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthdate: req.body.Birthdate
            })
            .then((user) => {res.status(201).json(user)})
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

/*app.post('/users',
    [//validation for request
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appeared to be valid.').isEmail()
    ], (req,res) => {

    //check the validation object for errors
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    //hashing the submitted password
    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOne({Username: req.body.Username})//search to see if the username is already existed
    .then((user) => {
        if (user) {
            //response when the user is already existed
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users
            .create({
              Username : req.body.Username,
              Password: hashedPassword,//using hashed password for the passowrd field
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })//response back to client letting them know that it has been completed
            .then((user) => {res.status(201).json(user)})
            .catch((error) => {//catch any problem that is encountered
                console.error(error);
                //response back to client letting them know that there is an error
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {//catch any problem that is encountered
        console.error(error);
        //response back to client letting them know that there is an error
        res.status(500).send('Error: ' + error);
    });
});

  // Update user info by username
  app.put('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
      Users.findOneAndUpdate({ username: req.params.username }, { $set:
        {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          birthday: req.body.birthday,
          favoriteMovies: req.body.favoriteMovies
        }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if(err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
  });*/

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }),(req, res) => {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),(req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }),(req, res) => {
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
  // listen for requests
//app.listen(8080, () => {
  //console.log('Your app is up and running on port 8080.');
//});
