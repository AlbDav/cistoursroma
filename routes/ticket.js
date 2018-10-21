var express = require('express');
var router = express.Router();
var fs = require('fs');
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
const {Pool} = require('pg');
const pool = new Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASS,
        port: process.env.PG_PORT
});
const path = process.env.PATH_TO_PROJECT;

/* GET home page. */
router.get('/', function(req, res, next) {
	var id = req.query.id;
	var token = req.query.token;
        pool.query('SELECT * FROM payments WHERE payment_id = $1 AND book_token = $2', [id, token], (error, result) => {
                if(error){
                        console.log(error);
                }
                if(result.rowCount == 0){
                        res.send('errore: nessuna prenotazione trovata');
                }
                else{
                        var ticket = result.rows[0];
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
									html: '<p>Ecco il tuo biglietto</p>',
									attachments: [{filename: 'ticket.pdf', path: path + '/public/tickets/' + token + '.pdf'}]
								};
								transporter.sendMail(mailOptions, function(err, info){
									if(err){
										conosle.log(err);
									}
									else{
										console.log(info);
										fs.unlink(path + '/public/tickets/' + token + '.pdf', (err) => {
											fs.unlink(path + '/public/tickets/' + token + '.png', (err) => {
												res.send('ticket sent');
											});
										});
									}
								});
							}
						});
					}
				});	
			});
                }
        });
});

module.exports = router;
