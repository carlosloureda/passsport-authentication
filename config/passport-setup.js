const passport = require('passport');
const secrets = require('./secrets')
const User = require('../models/user-model')

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

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

passport.use(new TwitterStrategy({
        consumerKey: secrets.twitter.login.consumerKey,
        consumerSecret: secrets.twitter.login.consumerSecret,
        callbackURL: secrets.twitter.login.callbackURL,
    },
    function(token, refreshToken, profile, done) {
        console.log("Twitter passport callback function fired")
        findOrSaveUser('twitter', profile, done);         
    }
));

passport.use(new GitHubStrategy({
        clientID: secrets.github.login.clientID,
        clientSecret: secrets.github.login.clientSecret,
        callbackURL: secrets.github.login.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("Github passport callback function fired")
        findOrSaveUser('github', profile, done);  
    }
));

passport.use(new LinkedInStrategy({
        clientID: secrets.linkedin.login.clientID,
        clientSecret: secrets.linkedin.login.clientSecret,
        callbackURL: secrets.linkedin.login.callbackURL,
        scope: ['r_emailaddress', 'r_basicprofile']
    }, function(accessToken, refreshToken, profile, done) {
        console.log("Linkedin passport callback function fired")
        findOrSaveUser('linkedin', profile, done);
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
        },
        'twitter': {
            id: 'twitterId',
            imagePath: platform == 'twitter' ? ( profile.photos && profile.photos.length ? profile.photos[0].value: null)  : null
        },
        'github': {
            id: 'githubId',
            imagePath: platform == 'github' ? ( profile.photos && profile.photos.length ? profile.photos[0].value: null)  : null
        },
        'linkedin': {
            id: 'linkedinId',
            imagePath: platform == 'linkedin' ? ( profile.photos && profile.photos.length ? profile.photos[0].value: null)  : null            
        }
    }
    console.log(profile)
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