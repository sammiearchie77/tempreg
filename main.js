const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send('Welcome to Tempreg')
});

app.get('/register', (req, res) => {
    res.send('Registration Page')
});

app.post('/register', (req, res) => {
    console.log(req.body);
});

app.listen(3000, () => {
    console.log('Server started at port 3000')
})