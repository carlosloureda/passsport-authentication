const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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

passport.use(new GoogleStrategy({   
        clientID: secrets.google.login.clientID,
        clientSecret: secrets.google.login.clientSecret,
        callbackURL: 'http://localhost:3000/auth/google/redirect' // neeed to be set in google console
    }, (accessToken, refreshToken, profile, done) => {
        console.log("Google passport callback function fired")
        findOrSaveUser('google', profile, done);      
    })
)

passport.use(new FacebookStrategy({
        clientID: secrets.facebook.login.clientID,
        clientSecret: secrets.facebook.login.clientSecret,
        callbackURL: secrets.facebook.login.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("Facebook passport callback function fired")
        findOrSaveUser('facebook', profile, done);         
    }
));

/* 
TODO: See how to make an unique object for the user and how to add other profiles from
profile view
*/
const findOrSaveUser = (platform, profile, callback) => {
    const platforms = {
        'facebook': {
            id: 'facebookId',
            imagePath: null
        },
        'google': {
            id: 'googleId',
            imagePath: platform == 'google' ? profile._json.image.url : null
        }
    }
    let key = platforms.platform;
    User.findOne({key: profile.id}).then((currentUser) => {
        if (currentUser) {
            callback(null, currentUser)
        } else {
            console.log("profile:",profile)
            new User({
                username: profile.displayName,
                key: profile.id,
                thumbnail: platforms[platform].imagePath
            }).save().then((newUser) => {
                callback(null, newUser);
            }).catch((err) => {
                console.log("error : " , err); 
                callback(err, null);
            })
        }
    })

}