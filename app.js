const express = require('express')
const authRoutes = require('./routes/auth-routes')
const profileRoutes = require('./routes/profile-routes')
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')
const secrets = require('./config/secrets')
const passport = require('passport')
const cookieSession = require('cookie-session')

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

app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/auth', authRoutes)

// set up profile
app.use('/profile', profileRoutes)

// create home route
app.get('/', (req, res) => {    
    res.render('home', { user: req.user })
})

app.listen(3000, () => {
    console.log("App now listening for request on port 3000")
})