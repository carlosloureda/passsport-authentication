const User = require('../models/user-model')
const emails = require('../config/emails')

// https://dzone.com/articles/using-mongodb-and-mongoose

const AccountController = {}

AccountController.register = (email, password, callback) => {
    //TODO: validate email and password    
    User.findOne({'local.email': email}).then((currentUser) => {
        if (currentUser) {
            callback(null, currentUser)
        } else {
            let newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);            
            let token = newUser.generateActivationToken()            
            //newUser.login.validated = false                        
            newUser.login.validationToken = token 
            newUser.login.validationTokenExpires =  Date.now() + 86400000 // 24 hours
            newUser.createdAt = Date.now()            
            newUser.save().then(() => {
                //TODO: should be treated aync ?
                emails.sendRegistrationEmail(newUser)
                callback(null, newUser);
            }).catch((err) => {
                console.log("error : " , err); 
                callback(err, null);
            })
        }
    })
};

// https://www.smashingmagazine.com/2017/11/safe-password-resets-with-json-web-tokens/
AccountController.validateEmail = (userId, token) => {
    return new Promise((resolve, reject) => {
        //User.findOne({'local.email': email}, function(err, user) {
        console.log("userId: ", userId)
        User.findOne({_id: userId}, function(err, user) {
            console.log("ERROR: ", err)
            console.log("user: ", user)
            if (err) {
                console.log("ERROR: ", err)
            }
            //const secret = user.generateTokenSecret()
            //const payload = user.decodeTokenPayload(token)

            // if (user.id === payload.id && user.password === payload.password) {
            if (user.login.validationToken === token) {
                //TODO: check dates and send error if not passed
                if (user.login.validationTokenExpires < Date.now()) {
                    reject("El token ha caducado")
                }
                //TODO: update database with validation
                const updateQuery = {
                    login: {
                        validated: true, 
                        activationDate: Date.now()
                    }
                }
                User.findByIdAndUpdate(userId, { $set: updateQuery }, (err, user) => {
                    if (err) reject(err)
                    console.log("updated validation db")
                    resolve(true)
                })
            } else {
                reject(false)
            }
        })
    })
} 

module.exports = AccountController;
