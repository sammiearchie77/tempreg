const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', { title: 'Tempreg | login'}));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('signReg', { title: 'Tempreg | Register'}));

// Register
router.post('/register', (req, res) => {
  const { firstname, lastname, email, contact, password, password2,carMake, model, year, vin, address, location } = req.body;
  let errors = []; 

  if (!firstname || !lastname || !email || !contact || !password || !password2 || !carMake || !model || !year || !vin || !address || !location ) {
    errors.push({ message: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ message: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ message: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('signReg', {
      errors,
      firstname,
      lastname,
      email,
      password,
      password2,

    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ message: 'Email already exists' });
        res.render('signReg', {
          errors,
          firstname,
          lastname,
          email,
          contact,
          password,
          password2,
          carMake,
          model,
          year,
          vin,
          address,
          location
        });
      } else {
        const newUser = new User({
          firstname,
          lastname,
          email,
          contact,
          password,
          carMake,
          model,
          year,
          vin,
          address,
          location
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_message',
                  'You are now registered and can log in'
                );
                res.redirect('./login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    successFlash: true,
    failureRedirect: './login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_message', 'You are logged out');
  res.redirect('./login');
});

module.exports = router;