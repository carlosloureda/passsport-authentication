const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const secrets = require('./secrets')
const User = require('../models/user-model')

passport.serializeUser((user, done) => {
    done(null, user.id); // create cookie with this user.id
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user); // remove cookie?
    })
    
})

passport.use(
    new GoogleStrategy({
        // options of the google strategy    
        clientID: secrets.google.login.clientID,
        clientSecret: secrets.google.login.clientSecret,
        callbackURL: 'http://localhost:3000/auth/google/redirect' // neeed to be set in google console
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback functions
        console.log("passport callback function fired")
        //console.log(profile);
        //TODO: check if it is not already here

        User.findOne({googleId: profile.id}).then((currentUser) => {
            if (currentUser) {
                //already have the user
                console.log("user is: ", currentUser)
                done(null, currentUser)
            } else {
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile._json.image.url
                }).save().then((newUser) => {
                    console.log("new user created: " , newUser); 
                    done(null, newUser);
                }).catch((err) => {
                    console.log("error : " , err); 
                })
            }
        })
        

    })
)