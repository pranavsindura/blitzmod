const express = require('express');
const os = require('os');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const uri = 'mongodb+srv://Dhairya-Shalu:light12345@first-demo-ocw10.mongodb.net/test?retryWrites=true&w=majority';

let moderator = require('./moderator');
let { upiPayModel } = require('./paymodel');
let { userModel } = require('./model');
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
                message: "Invalid Credentials!"
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

app.post('/user', (req, res) => {
    let userInput = req.body;
    let id = userInput.blitzID;
    moderator.retrieveUser(id).then(function(user) {
        if (user) {
            user.blitzPIN = undefined;
            res.send({
                status: true,
                message: user
            });
        } else {
            res.send({
                status: false,
                message: "Internal Error"
            });
        }
    });
});

app.post('/accomodation', (req, res) => {
    moderator.findMaleAcc().then(function(maleArr) {
        if (maleArr) {
            moderator.findFemaleAcc().then(function(femaleArr) {
                if (femaleArr) {
                    moderator.findOthersAcc().then(function(othersArr) {
                        if (othersArr) {
                            let data = {
                                males: maleArr,
                                females: femaleArr,
                                others: othersArr
                            };
                            res.send({
                                status: true,
                                message: data
                            });
                        } else {
                            res.send({
                                status: othersArr,
                                message: 'Internal Error'
                            });
                        }
                    });
                } else {
                    res.send({
                        status: false,
                        message: 'Internal Error'
                    });
                }
            });
        } else {
            res.send({
                status: false,
                message: 'Internal Error'
            });
        }
    });
});

app.post('/viewTransactions', (req, res) => {
    upiPayModel.find({}).then(function(payments) {
        if (payments) {
            res.send({
                status: true,
                message: payments
            });
        } else {
            res.send({
                status: false,
                message: "Interanl Error"
            });
        }
    });
});

app.post('/transaction', (req, res) => {
    let userInput = req.body;
    upiPayModel.findOneAndUpdate({ _id: userInput._id }, { approval: true }).then(function(result) {
        if (result) {
            userModel.find({ blitzID: userInput.blitzID }).then(function(user) {
                if (user) {
                    let obj = {
                        packages: userInput.packages,
                        amount: userInput.amount,
                        transactionID: userInput.transactionID
                    };
                    let ph = user[0].paymentHistory;
                    ph.push(obj);
                    userModel.findOneAndUpdate({ blitzID: userInput.blitzID }, { paymentHistory: ph }).then(function(flag) {
                        if (flag) {
                            res.send({
                                status: true,
                                message: ''
                            })
                        } else {
                            res.send({
                                status: false,
                                message: 'Internal Error'
                            })
                        }
                    })
                } else {
                    res.send({
                        status: false,
                        message: 'Interanl Error'
                    });
                }
            })
        } else {
            res.send({
                status: false,
                message: 'Interanl Error'
            });
        }
    });
});

app.post('/addTransaction', (req, res) => {
    let userInput = req.body;

    userModel.findOne({ blitzID: String(userInput.blitzID) }).then(function(user) {
        let obj = new upiPayModel();

        // let obj = {
            obj.blitzID= user.blitzID;
            obj.firstName= user.firstName;
            obj.lastName= user.lastName;
            obj.mob= user.mob;
            obj.email= user.email;
            obj.amount= userInput.amount;
            obj.transactionID= userInput.transactionID;
            obj.approval= false;
        // };

        obj.save().then((result) => {
            res.send({
                status: true,
                message: ""
            });
        }).catch(err => {
            res.send({
                status: false,
                message: "Some Error Occured!"
            });
        });

    }).catch(err => {
        res.send({
            status: false,
            message: "Internal error!"
        });
    });
});

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

const server = app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
server.timeout = 240000; 