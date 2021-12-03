const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

var userObject;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('static_files'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', {userName: 'Temitope'});
});

app.get('/register', (req, res) => {
    res.render('register', {});
});

app.post('/register', (req, res) => {
    console.log(req.body);
    userObject = req.body;
    res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
    console.log({userObject});
    res.render('dashboard', userObject);
});

app.listen(3000, () => {
    console.log('Server started at port 3000')
})