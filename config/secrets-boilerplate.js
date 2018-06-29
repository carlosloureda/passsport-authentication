/* Boilerplate for Secrets to be added.
   Please copy this file reanmed into a screts.js file in this folder and add
   all the keys you need to have the project working
*/
const secrets = {
    google: {
        login: {
            clientID: '<clientID>',
            clientSecret: '<clientSecret>' 
        }
    },
    google: {
        login: {
            clientID: '<clientID>',
            clientSecret: '<clientSecret>',
            callbackURL: '<callbackURL>'
        }
    },
    twitter: {
        login: {
            consumerKey: '<consumerKey>',
            consumerSecret: '<consumerSecret>',
            callbackURL: '<callbackURL>'
        }
    },
    github: {
        login: {
            clientID: '<clientID>',
            clientSecret: '<clientSecret>',
            callbackURL: '<callbackURL>'
        }
    },
    linkedin: {
        login: {
            clientID: '<clientID>',
            clientSecret: '<clientSecret>',
            callbackURL: '<callbackURL>'
        }
    },
    mongodb: {
        dbURI: '<dbURI>'
    },
    session: {
        cookieKey: '<cookieKey>'
    }   

}

module.exports = secrets;