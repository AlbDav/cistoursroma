var express = require('express');
var router = express.Router();
var qr = require('qrcode');
var rand_str = require('randomstring');
var ejs = require('ejs');
var pdf = require('html-pdf');
var mail = require('nodemailer');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
	process.env.GMAIL_ID,
	process.env.GMAIL_SECRET,
	"https://developers.google.com/oauthplayground"
);
oauth2Client.setCredentials({
	refresh_token: process.env.GMAIL_REFRESH
});

/* GET home page. */
router.get('/', function(req, res, next) {
	var path = process.env.PATH_TO_PROJECT;
	var token = rand_str.generate();
	var filename = '/tickets/' + token + '.png';
	qr.toFile(path + '/public' + filename,'Questo è il ticket con token ' + token, function(err){
		console.log('img done');
		console.log(path + '/public' + filename);
		ejs.renderFile(path + '/views/ticket.ejs', {img_path: 'file://' + path + '/public' + filename}, function(err, result){
			if(result){
				console.log('ciao');
				pdf.create(result).toFile(path + '/public/tickets/' + token + '.pdf', function(error, resultpdf){
					if(err){
						console.log('errore');
					}
					else{
						console.log(resultpdf);
						res.send('ticket created');
					}
				});
			}
		});	
	});
	var accessToken = oauth2Client.refreshAccessToken()
		.then(res => res.credentials.access_token);
	var transporter = mail.createTransport({
		service: 'gmail',
		auth: {
			type: "OAuth2",
			user: process.env.GMAIL_USER,
			clientId: process.env.GMAIL_ID,
			clientSecret: process.env.GMAIL_SECRET,
			refreshToken: process.env.GMAIL_REFRESH,
			accessToken: accessToken
		}
	});
	var mailOptions = {
		from: process.env.MAIL_USER,
		to: process.env.MAIL_ADDRESS,
		subject: 'Subject',
		html: '<p>Html</p>'
	};
	transporter.sendMail(mailOptions, function(err, info){
		if(err){
			conosle.log(err);
		}
		else{
			console.log(info);
		}
	});
});

module.exports = router;
