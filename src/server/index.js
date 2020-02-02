const express = require('express');
const os = require('os');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const uri = 'mongodb+srv://Dhairya-Shalu:light12345@first-demo-ocw10.mongodb.net/test?retryWrites=true&w=majority';

let moderator = require('./moderator');

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(cors());

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    dbName: 'Blitzschlag20'
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
    console.log('Connected to the database');
});

app.post('/moderatorLogin', (req, res) => {
    let userInput = req.body;
    moderator.validateMod(userInput.id, userInput.blitzPIN).then(function(result) {
        if (result === false) {
            res.send({
                status: false,
                message: "Interanl Error"
            });
        } else {
            res.send({
                status: true,
                message: result
            });
        }
    });
});

app.post('/eventdata', (req, res) => {
    let userInput = req.body;
    moderator.findUsersOfEvent(userInput.eventID).then(function(result) {
        if (result === false) {
            res.send({
                status: false,
                message: "Internal error"
            });
        } else {
            res.send({
                status: true,
                message: result
            });
        }
    });
});

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));