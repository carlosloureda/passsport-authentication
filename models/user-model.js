const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jwt-simple');

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    local: {
        email: String,
        password: String,       
    },
    login: {
        validated: { type: Boolean, default: false },
        activationDate: Number, // Number???,
        validationToken: String,
        validationTokenExpires: Number,
        resetPasswordToken: String,
        resetPasswordExpires: Date
        //logs:[] // 

    },
    createdAt: Number,
    googleId: String, // For knowing second time he/she logs in    
    facebookId: String,
    twitterId: String,
    githubId: String,
    linkedinId: String,
    thumbnail: String,
    
})

// methods ======================

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// checking if password is valid
// https://www.smashingmagazine.com/2017/11/safe-password-resets-with-json-web-tokens/
userSchema.methods.generateActivationToken = function() {      
    const payload = this.generateTokenPayload()
    const secret = this.generateTokenSecret()    
    const token = jwt.encode(payload, secret)
    return token
};

/**
 * generates a secret for the activaiton token ançd recovery passwords
 */
userSchema.methods.generateTokenSecret = function() {     
    return this.local.email + '-' + this.createdAt  
}
userSchema.methods.generateTokenPayload = function(){
   return { id:  this.id, email: this.local.email }
}
userSchema.methods.decodeTokenPayload = function(token) {
    console.log("token: ", token)
    const secret = this.generateTokenSecret()
    console.log("secret: ", secret)
    return jwt.decode(token, secret)
} 


const User = mongoose.model('user', userSchema)

module.exports = User

/*var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});*/


/* 
    - Generate hashed token (must be random number and secure)
    - Set a expirying date (in miliseconds ?? , in dates ???, in hours ???)

    > If validation approbes:
        - we validate the user
    > Else:
        - return error
        - provide a method to reset the password token ?? --> recover password form        

*/