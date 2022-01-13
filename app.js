const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')


const app = express();

// passport config 
require('./config/passport')(passport);


// db config
const db = require('./config/keys').mongoUrl;

// connect to mongo db 
mongoose.connect(db, { useNewUrlParser: true})
    .then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err));

// Middleware 
app.use(expressLayouts);
app.set('view engine', 'ejs');

// bodyParser 
app.use(express.urlencoded({
    extended: false
}))

// express session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))

  app.use(passport.initialize());
  app.use(passport.session());


//   connect flash 
app.use(flash)

// global var 
app.use((req,res, next) => {
    res.locals.success_message = req.flash('success_message')
    res.locals.error_message = req.flash('error_message')
    res.locals.error = req.flash('error')
    next();
})

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
// app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server listening at port ${PORT}`));