const nodemailer = require('nodemailer');
const sendGridTransport = require("nodemailer-sendgrid-transport");
const becrypt = require('bcryptjs');
const  { validationResult } = require('express-validator');

const { sendGridApiKey, userTypeAdmin, userTypeProjectManager, userTypeTeam } = require('../config');

const User = require('../models/user');
const UserType = require('../models/userType');


const transporter = nodemailer.createTransport(sendGridTransport({
    auth : {
        api_key: sendGridApiKey
    }
}));

exports.sendEmail = (to, subject, html) => {
    SendEmail(to, subject, html);
}

SendEmail = (to, subject, html) => {
    transporter.sendMail({
        to: to,
        from: 'ahsan@littlewins.com',
        subject: subject,
        html: html
    }).catch(err => console.log('Mail Error', err));
    return true;
}

// Authorization Is Admin

exports.isAdmin = (req, res, next) => {

    const user = req.jwtOptions.user;
    // console.log(user);
    // return res.status(401).json({msg: 'you are not admin user', user});

    if(user.userType.title.toLowerCase() === userTypeAdmin) {
        req.userTypeId = user.userType.id;
        next();
    }
    else {
        return res.status(401).json({msg: 'You are not an admin user'});
    }
}

// Authorization Is USER_TYPE_PROJECT_MANAGER

exports.isProjectManager = (req, res, next) => {

    const user = req.jwtOptions.user;
    if(user.userType.title.toLowerCase() === userTypeProjectManager) {
        req.userTypeId = user.userType.id;
        next();
    }
    else {
        return res.status(401).json({msg: 'User not found'});
    }
}

// Authorization Is ClUSER_TYPE_TEAMient

exports.isTeamMember = (req, res, next) => {

    const user = req.jwtOptions.user;
    if(user.userType.title.toLowerCase() === userTypeTeam) {
        req.userTypeId = user.userType.id;
        next();
    }
    else {
        return res.status(401).json({msg: 'User not found'});
    }
}

exports.getUserType = (req, res, next) => {
    const { userType } = req.body;
    // console.log('USERTYPE===============',  userType)
    if(userType === userTypeProjectManager) {
        UserType.findOne({where: {title: userType}}).then(item => {
            req.body.userTypeId = item.id;
            return next();
        }).catch(err = console.log(err));
    } else {
        if(userType === userTypeTeam) {
            UserType.findOne({where: {title: userType}}).then(item => {
                req.body.userTypeId = item.id;
                return next();
            }).catch(err = console.log(err));
        } else {
            // console.log('ADMIN ------=============----->>> ', userType)
            UserType.findOne({where: {title: userType}}).then(item => {
                req.body.userTypeId = item.id;
                console.log('ADMIN req.userTypeId =>>>>>>=>>>>>>>> ', req.body.userTypeId);
                return next();
            }).catch(err => console.log(err));
        }
    }

    

}

exports.postUser = (req, res, next) => {
    let { firstName, lastName, email, password, gender, country, city, isAgreeTerms, zipCode, userTypeId} = req.body;
    console.log('userTypeId  ============= ++++++== ==========', req.body.userTypeId);
    if(password=== null || password === undefined ) {
        password = 'admin123';
    }
    if(firstName == null || firstName === undefined ) {
        firstName = 'abc';
        lastName = 'abc';
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    // console.log(firstName + ' ' + lastName + ' ' + email + ' ' + password);
    getUser({email: email}).then(user => {
        if(!user) {
            becrypt.hash(password, 12)
        .then( hashedPassword => {
            const userObj = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                isAgreeTerms: isAgreeTerms,
                userTypeId: userTypeId,
                gender: gender,
                country: country,
                city: city,
                isActive: true,
                zipCode: zipCode
            });
            return userObj.save();
        }).then(result => {
            if(firstName !== null || firstName !== undefined) {
                SendEmail(email, 'Signup Successfull', `<h1> Wellcome ${firstName} ${lastName} to Error Handling App.`);
            }
            return res.status(201).json({ msg: 'successfulll Added.' });
        })
        } else {
            res.status(500).json('Email already exists... ' + email);
        }
    })
    .catch(err => {
        res.status(501).json('Error ' + err);
    });
}

// Get one user
const getUser = async obj => {
    return await User.findOne({
    where: obj,
  });
};