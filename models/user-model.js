const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    googleId: String, // For knowing second time he/she logs in    
    facebookId: String,
    twitterId: String,
    githubId: String,
    linkedinId: String,
    thumbnail: String
})

const User = mongoose.model('user', userSchema)

module.exports = User