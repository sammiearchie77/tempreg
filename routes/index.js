const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Profile = require('../models/Profile');
const Vehicle = require('../models/Vehicle');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get('/profile', ensureAuthenticated, (req, res) =>
  res.render('profile', {
    user: req.user
  })
);

router.post('/profile', async (req, res) => {
  const profile = new Profile({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    contact: req.body.contact,
    address: req.body.address,
    id: req.body.id
  });
    profile.save()
    .then(data => {
      res.status(200).render('dashboard', {
        user: req.user
      })
    })
    .catch(err => {
      res.json({ message: err });
    })
})

// get vehicle request 
router.get('/vehicle', ensureAuthenticated, (req, res) => {
  res.render('vehicle', {
    user: req.user
  })
});

// post vehicle req 
router.post('/vehicle', ensureAuthenticated, (req, res) => {
  const vehicle = new Vehicle({
    name: req.body.name,
    model: req.body.model,
    year: req.body.year,
    vin: req.body.vin
  });
    vehicle.save()
    .then(data => {
      req.flash('success_message',
          'Profile status updated and saved');
      res.status(200).render('dashboard', {
        user: req.user
      })
    })
    .catch(err => {
      res.json({ message: err });
    })
});

router.get('/settings', ensureAuthenticated, (req, res) =>
  res.render('settings', {
    user: req.user
  })
);

module.exports = router;