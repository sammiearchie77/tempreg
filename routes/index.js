const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home', { title: 'Tempreg | Home of Vehicle Tracking'}));

router.get('/info/', forwardAuthenticated, (req, res) => {
  res.render('search')
})
router.post('/info/', forwardAuthenticated, (req, res) => {
  const userName = req.body.search;
  console.log(userName);
  const userResult = Profile.find({
      fullname: userName
    }, function(err, person){
      if(err) return handleError(err);
      console.log(person);
      res.redirect('/info/')
    })
    
})

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    title: 'Tempreg | Dashboard',
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



router.get('/settings', ensureAuthenticated, (req, res) =>
  res.render('settings', {
    user: req.user
  })
);

module.exports = router;