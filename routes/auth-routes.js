const router = require('express').Router()
const passport = require('passport')
const AccountController = require('../controllers/account')
const User = require('../models/user-model')
const emails = require('../config/emails')
/*
 * =============================================================================
 *            REGISTER & LOGIN (LOCAL) & LOGOUT
 * =============================================================================
 */
// process the signup form
router.post('/register', passport.authenticate("local-signup", {failureRedirect: '/auth/login'}), (req, res) => {
    res.redirect('/auth/login');    
})

// auth register
router.get('/register', (req, res) => {
    //res.render('signup',  { message: req.flash('signupMessage') })
    res.render('auth/signup')
})

// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
    //failureFlash : true // allow flash messages
}));

// auth login
router.get('/login', (req, res) => {
    res.render('auth/login', { user: req.user } )
})

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

/*
 * =============================================================================
 *            EMAIL VALIDATION | RECOVER PASSWORD  
 * =============================================================================
 */
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

//get forgotpassword
router.get('/forgot-password', (req, res) => {
    res.render('auth/forgotpassword')
})
//post forgotpassword
router.post('/forgot-password', (req, res) => {
    let email = req.body.email
    //TODO: validate email
    AccountController.createRecoverPasswordToken(email)
    //TODO: SHOW messages ...
    res.redirect('/auth/forgot-password')

})
// get reset-password /:id/:token
router.get('/reset-password/:id/:token', (req, res) => {
    let { id, token } = req.params
    // TODO: validate things
    res.render('auth/reset-password', { userId: id, token: token } )    
})

//TODO: post new password
router.post('/reset-password', (req, res) => {
    let { password, token, userId } = req.body
    // TODO: validate
    
    User.findOne({'_id': userId}).then((user) => {
        if (user.login.resetPasswordToken === token) {            
            //TODO: logs? IP? 
            user.local.password = user.generateHash(password);
            user.login.resetPasswordToken = ""
            user.login.resetPasswordExpires = ""
            User.update({'_id': userId}, {
                local: user.local,
                login: user.login
            }, function(err, user) {
                //TODO: show toast          
                emails.sendPasswordChangedEmail(user)      
                res.redirect('/auth/login');
            })        
        }
    })
    //TODO: when errors redirect
})

/*
 * =============================================================================
 *            SOCIAL LOGIN
 * =============================================================================
 */
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
