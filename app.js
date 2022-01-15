const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const path = require('path')


const app = express();

// passport config 
require('./config/passport')(passport);


// db config
const db = require('./config/keys').mongoUrl;

// connect to mongo db 
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err));

// Middleware 
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public/static')))

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

//   passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// connect flash 
app.use(flash());

// global varables 
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message')
    res.locals.errors_message = req.flash('errors_message');
    next()
})



app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server listening at port ${PORT}`));