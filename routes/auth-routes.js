const router = require('express').Router()
const passport = require('passport')

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
router.get('/google/redirect', passport.authenticate("google", {failureRedirect: '/login'}), (req, res) => {        
    res.redirect('/profile/');    
})

/* FACEBOOK */
// auth with facebook, scope is what we want from the user
router.get('/facebook', passport.authenticate("facebook"));

//callback route for google to redirect to, magic for retrieving the code
router.get('/facebook/redirect', passport.authenticate("facebook", {failureRedirect: '/login'}), (req, res) => {        
    res.redirect('/profile/');    
})

module.exports = router
