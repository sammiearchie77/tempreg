const { MongoClient, ObjectId } = require("mongodb");
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const { request, response } = require("express");
const ejs = require('ejs');


const client = new MongoClient(process.env["ATLAS_URI"]);
const app = express();

var userObject;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('static_files'));
app.set('view engine', 'ejs');

var collection;

app.get('/search', async (request, response) => {
    try {
        let result = await collection.aggregate([
            {
                "$search": {
                    "autocomplete": {
                        "query": `${request.query.query}`,
                        "path": "name",
                        "fuzzy": {
                            "maxEdits": 2,
                            "prefixLength": 3
                        }
                    }
                }
            }
        ]).toArray();
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

app.get('/get/:id', async (request, response) => {
    try {
        let result = await collection.findOne({ "_id": ObjectId(request.params.id) });
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
 });

app.get('/', (req, res) => {
    res.render('home', { userName: 'Temitope' });
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
    console.log({ userObject });
    res.render('dashboard', userObject);
});

app.listen(3000, async () => {
    try {
        await client.connect();
        collection = client.db("tempreg").collection("cars")
    } catch (e) {
        console.error(e)
    }
    console.log('Server started at port 3000')
})