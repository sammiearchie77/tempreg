const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')



// user Model 
const User = require('../models/User');
const { request } = require('express');

//login route
router.get('/login', (req, res) => {
    res.render('login')
})

//Register route
router.get('/register', (req, res) => {
    res.render('signReg')
})

// Handle Register 
router.post('/register', (req, res) => {
    // logic for registeration details
    const { name, email, password, password2 } = req.body;
    let errors = [];
    //    check req fields 
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please fill in all fields." })
    }

    // check password match 
    if (password !== password2) {
        errors.push({ message: "Password do not match." })
    }

    // Check  password length 
    if (password.length < 8) {
        errors.push({ message: "password should be at least 8 characters" })
    }

    if (errors.length > 0) {
        res.render('signReg', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed 
        User.findOne({ email: email }).then(user => {
            if (user) {
                // if user exist ??
                errors.push({ message: "Email is alread Registered." });
                res.render('signReg', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(newUser.password, salt);
                newUser.password = hash
                // console.log(newUser.password);
                newUser.save()
                .then(user => {
                    req.flash('success_message', `You are registered `)
                    res.redirect('login');
                })
                .catch(err => console.log(err));
            }
        });
    }
})

// login handle 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
})

// logout route 
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('sucess_message', 'You are logged out')
    res.redirect('users/login')
});

module.exports = router;