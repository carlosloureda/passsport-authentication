var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
const secrets = require('./secrets')

/* 
    https://medium.com/code-well-live-forever/emails-with-nodemailer-sendgrid-c98cd37c8e03
*/

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: secrets.emails.sendGrid.user,
        pass: secrets.emails.sendGrid.password
    }
});

const from = '"Fred Foo ?" <carloslouredaparrado@gmail.com>'

const sendHelloWorldEmail = () => {
    
    console.log("Sending hello world email")
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: from, // sender address
        to: 'balanzeneto@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world - 2 ?', // plaintext body
        html: '<b>Hello world 2 ?</b>' // html body
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

const sendRegistrationEmail = (userModel) => {
    // setup e-mail data with unicode symbols
    let authUrl = `http://localhost:3000/auth/confirm-email/${userModel.id}/${userModel.login.validationToken}`
    console.log("authUrl: ", authUrl)
    var mailOptions = {
        from: from, // sender address
        to: userModel.local.email, // list of receivers
        subject: '¡Bienvenido!', // Subject line
        text: 'Sigue el enlace para registrar tu aplicación', // plaintext body
        html: `<b>Sigue el enlace para registrar tu aplicación: <a href="${authUrl}">enlace</a></b>` // html body
    };    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports = {
    sendHelloWorldEmail, sendRegistrationEmail
}
