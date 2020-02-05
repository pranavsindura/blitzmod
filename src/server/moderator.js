let { moderatorModel } = require('./model');
let { userModel } = require('./model');
let { eventModel } = require('./modelEventSociety');

async function validateMod(id, pin) {
    let mod = await moderatorModel.findOne({ blitzID: id }, (err) => {
        if (err) {
            console.log('err');
        }
    });
    if (mod.blitzPIN === pin) {
        let data = {
            eventID: mod.eventID,
            eventName: mod.eventName
        }
        return data;
    } else {
        return false;
    }
}

async function findUsersOfEvent(id) {
    let result = [];
    let data = await eventModel.find({ eventID: id }, (err) => {
        if (err) {
            console.log('not found');
        }
    });
    // console.log(data);
    if (data) {
        let ids = [];
        for (i = 0; i < data.length; i++) {
            ids.push(String(data[i].blitzID));
        }
        let users = await userModel.find({ blitzID: ids });
        for (user of users) {
            for (x of data) {
                if (user.blitzID === String(x.blitzID)) {
                    let obj = {
                        blitzID: user.blitzID,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        teamID: x.teamID,
                        teamName: x.teamName,
                        teamSize: x.teamSize,
                        mob: user.mob,
                        email: user.email
                    };
                    result.push(obj);
                }
            }
        }

        // for (i = 0; i < data.length; i++) {
        //     let obj = {
        //         blitzID: '',
        //         firstName: '',
        //         lastName: '',
        //         teamID: data[i].teamID,
        //         teamName: data[i].teamName,
        //         teamSize: data[i].teamSize,
        //         mob: '',
        //         email: ''
        //     };
        //     let user = await userModel.findOne({ blitzID: String(data[i].blitzID) }, (err) => {
        //         if (err) {
        //             console.log('errrrr');
        //         }
        //     });
        //     obj.blitzID = user.blitzID;
        //     obj.firstName = user.firstName;
        //     obj.lastName = user.lastName;
        //     obj.mob = user.mob;
        //     obj.email = user.email;
        //     result.push(obj);
        // }
        return result;
    } else {
        console.log('no data');
        return false;
    }
}

async function retrieveUser(id) {
    let user = await userModel.findOne({ blitzID: id }, (err, result) => {
        if (err) {
            console.log('ID not found');
        }
    });
    return user;
}

async function findMaleAcc() {
    let result = await userModel.find({ gender: 'Male', accomodation: true }, (err, result) => {
        if (err) {
            console.log('error');
        }
    });
    for (user of result) {
        user.blitzPIN = undefined;
        user.hospitality = undefined;
        user.paymentHistory = undefined;
        user.gender = undefined;
        user.collegeID = undefined;
        user.year = undefined;
        user.course = undefined;
        user.branch = undefined;
        user.isMNIT = undefined;
        user.accomodation = undefined;
        user.events = undefined;
        user.__v = undefined;
    }
    return result;
}

async function findFemaleAcc() {
    let result = await userModel.find({ gender: 'Female', accomodation: true }, (err, result) => {
        if (err) {
            console.log('error');
        }
    });
    for (user of result) {
        user.blitzPIN = undefined;
        user.hospitality = undefined;
        user.paymentHistory = undefined;
        user.gender = undefined;
        user.collegeID = undefined;
        user.year = undefined;
        user.course = undefined;
        user.branch = undefined;
        user.isMNIT = undefined;
        user.accomodation = undefined;
        user.events = undefined;
        user.__v = undefined;
    }
    return result;
}

async function findOthersAcc() {
    let result = await userModel.find({ gender: 'Others', accomodation: true }, (err, result) => {
        if (err) {
            console.log('error');
        }
    });
    for (user of result) {
        user.blitzPIN = undefined;
        user.hospitality = undefined;
        user.paymentHistory = undefined;
        user.gender = undefined;
        user.collegeID = undefined;
        user.year = undefined;
        user.course = undefined;
        user.branch = undefined;
        user.isMNIT = undefined;
        user.accomodation = undefined;
        user.events = undefined;
        user.__v = undefined;
    }
    return result;
}

module.exports = {
    validateMod,
    findUsersOfEvent,
    retrieveUser,
    findMaleAcc,
    findFemaleAcc,
    findOthersAcc
}