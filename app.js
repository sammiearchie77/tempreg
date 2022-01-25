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
const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')

AdminBro.registerAdapter(AdminBroMongoose)
const User = require('./models/User')
const Admin = require('./models/Admin');

const app = express();




// admin config 
const adminBro = new AdminBro({
    resources: [{
        resource: Admin,
        options: {
          properties: {
            encryptedPassword: {
              isVisible: false,
            },
            password: {
              type: 'string',
              isVisible: {
                list: false, edit: true, filter: false, show: false,
              },
            },
          },
          actions: {
            new: {
              before: async (request) => {
                if(request.payload.password) {
                  request.payload = {
                    ...request.payload,
                    encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                    password: undefined,
                  }
                }
                return request
              },
            }
          }
        }
      }],
    rootPath: '/admin',
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

// bodyParser 
app.use(bodyParser.urlencoded({
    extended: true
}))

// formidableMiddleware 
// app.use(formidableMiddleware());

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
const AdminRouter = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        const user = await Admin.findOne({ email })
        if (user) {
            const matched = await bcrypt.compare(password, user.encryptedPassword)
            if(matched){
                return user
            }
        }
        return false
    },
    cookiePassword: 'some-secret-password-used-to-secure-cookie',
})


app.use(adminBro.options.rootPath, AdminRouter)

const PORT = process.env.PORT || 3000;


app.listen(PORT, console.log(`Server listening at port ${PORT}`));