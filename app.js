const express = require('express')
const authRoutes = require('./routes/auth-routes')
const profileRoutes = require('./routes/profile-routes')
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')
const secrets = require('./config/secrets')
const passport = require('passport')
const cookieSession = require('cookie-session')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const blzEmails = require('./config/emails')
//const flash = require('connect-flash');

const app = express()

// set up view engine
app.set('view engine', 'ejs')

//connect to mongodb
mongoose.connect(secrets.mongodb.dbURI, () => {
    console.log("connected to mongodb")
})

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [secrets.session.cookieKey]
}))

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser()); // get information from html forms
app.use(passport.initialize());
app.use(passport.session());
//app.use(flash());

// set up routes
app.use('/auth', authRoutes)

/*
app.post('/auth/register', passport.authenticate('local-signup'), (req, res) => { 
    console.log("REGISGTER LOCAL SIGNUP CALLBACK, ")    
    res.end();
})*/
// set up profile
app.use('/profile', profileRoutes)

// create home route
app.get('/', (req, res) => {       
    // User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.121 Safari/537.36 Vivaldi/1.95.1077.41
    console.log('User-Agent: ' + req.headers['user-agent']);
    
    var ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];
    
    // ip: ::1
    console.log('ip: ' + ip);

    // For mobile phones we need to send the information from the phone

    //blzEmails.sendHelloWorldEmail()
    res.render('home', { user: req.user })
})

app.listen(3000, () => {
    console.log("App now listening for request on port 3000")
})