const router = require('express').Router()
const passport = require('passport')
const AccountController = require('../controllers/account')

// process the signup form
router.post('/register', passport.authenticate("local-signup", {failureRedirect: '/auth/login'}), (req, res) => {
    res.redirect('/auth/login');    
})

// auth register
router.get('/register', (req, res) => {
    //res.render('signup',  { message: req.flash('signupMessage') })
    res.render('signup')
})

/* Activate and recover passwords */
router.get('/confirm-email/:id/:token', (req, res) => {
    let id = req.params.id
    let token = req.params.token
    //res.send("good job!")
    AccountController.validateEmail(id, token).then(() => {
        // TODO: show toast 
        res.redirect('/auth/login');
    }).catch((err) => {
        //TODO: Show errors
        console.log("err: ",err)
        //TODO:  404? or what?
    })
})

// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
    //failureFlash : true // allow flash messages
}));

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user } )
})

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

/* GOOGLE */
// auth with google, scope is what we want from the user
router.get('/google', passport.authenticate("google", {
    scope: ['profile']
}))

//callback route for google to redirect to, magic for retrieving the code
router.get('/google/redirect', passport.authenticate("google", {failureRedirect: '/auth/login'}), (req, res) => {        
    res.redirect('/profile/');    
})

/* FACEBOOK */
// auth with facebook, scope is what we want from the user
router.get('/facebook', passport.authenticate("facebook"));

//callback route for google to redirect to, magic for retrieving the code
router.get('/facebook/redirect', passport.authenticate("facebook", {failureRedirect: '/auth/login'}), (req, res) => {        
    res.redirect('/profile/');    
})

/* TWITTER */
// auth with twitter, scope is what we want from the user
router.get('/twitter', passport.authenticate("twitter"));

//callback route for google to redirect to, magic for retrieving the code
router.get('/twitter/redirect', passport.authenticate("twitter", {failureRedirect: '/auth/login'}), (req, res) => {        
    res.redirect('/profile/');    
})

/* GITHUB */
// auth with github, scope is what we want from the user
router.get('/github', passport.authenticate("github", { scope: [ 'user:email' ] }));

//callback route for google to redirect to, magic for retrieving the code
router.get('/github/redirect', passport.authenticate("github", {failureRedirect: '/auth/login'}), (req, res) => {        
    res.redirect('/profile/');    
})

/* LINKEDIN */
// auth with linkedin, scope is what we want from the user
router.get('/linkedin', passport.authenticate("linkedin"));

//callback route for google to redirect to, magic for retrieving the code
router.get('/linkedin/redirect', passport.authenticate("linkedin", {failureRedirect: '/auth/login'}), (req, res) => {        
    res.redirect('/profile/');    
})

module.exports = router
