const router = require('express').Router()

const authCheck = (req, res, next) => {
    if ( ! req.user ) {
        res.redirect('/auth/login')
    } else {
        next();
    }
}

router.get('/', authCheck, (req, res) => {    
    //res.status(200).send('you are logged in, this is yor profile: ' + req.user.username)
    res.render('profile', {user: req.user})
})

module.exports = router