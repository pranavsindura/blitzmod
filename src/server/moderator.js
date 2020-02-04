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
    let obj = {
        blitzID: '',
        firstName: '',
        lastName: '',
        teamID: 0,
        teamName: '',
        teamSize: 0,
        mob: '',
        email: ''
    };
 
    let data = await eventModel.find({ eventID: id }, (err) => {
        if (err) {
            console.log('not found');
        }
    });
    // console.log('data', data.length)
    if (data) {
        let ids = [];
        for (x of data) {
            ids.push(String(x.blitzID));
        }
        console.log('ids', ids.length)
        let users = await userModel.find({ blitzID: ids }, (err) => {
            if (err) {
                // console.log('error in user model');
            }
        });
        // console.log('users', users.length)
        if (users) {
            // console.log('ids', ids.length);
            // console.log('users', users.length);
            let vis=[];
            for(let i=0;i<ids.length;i++)
                vis.push(false);
            for(let i=0;i<users.length;i++)
            {
                let f = false;
                for(let j=0;j<ids.length;j++)
                {
                    if(users[i].blitzID === ids[j] && !vis[j])
                        f=true, vis[j]=true;
                }
                if(!f)
                    console.log('EXTRA',users[i]);
            }
            for (let i = 0; i < users.length; i++) {
                obj.blitzID = users[i].blitzID;
                obj.firstName = users[i].firstName;
                obj.lastName = users[i].lastName;
                obj.teamID = data[i].teamID;
                obj.teamName = data[i].teamName;
                obj.teamSize = data[i].teamSize;
                obj.mob = users[i].mob;
                obj.email = users[i].email;
                result.push({...obj});
            }
            // console.log('result', result);
        }
    } else {
        console.log('no data');
        return false;
    }
    return result;
    // return [];
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