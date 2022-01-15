const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

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

router.get('/vehicle', ensureAuthenticated, (req, res) =>
  res.render('vehicle', {
    user: req.user
  })
);
router.get('/settings', ensureAuthenticated, (req, res) =>
  res.render('settings', {
    user: req.user
  })
);

module.exports = router;