const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const path = require('path')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
// admin bro 
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')

AdminJS.registerAdapter(AdminJSMongoose)


const User = require('./models/User')
const Admin = require('./models/Admin');

const app = express();


const adminJs = new AdminJS({
  resources: [User, {
    resource: Admin,
    options: {
      
    },
  }],
  rootPath: '/admin',
})

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.password)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})

// passport config 
require('./config/passport')(passport);


// db config
const db = require('./config/keys').mongoUrl;
const router = require('./routes/index');

// connect to mongo db 
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err));

// Middleware 
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public/static')))

// admin js 
app.use(adminJs.options.rootPath, adminRouter)

// bodyParser 
app.use(bodyParser.json())
app.use(express.urlencoded({
  extended: true
}));

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


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server listening at port ${PORT}`));