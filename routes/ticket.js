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
        pool.query('SELECT * FROM payments, products_en WHERE payments.payment_id = $1 AND payments.book_token = $2 AND payments.product_id = products_en.product_id', [id, token], (error, result) => {
                if(error){
                        console.log(error);
                }
                if(result.rowCount == 0){
                        res.send('errore: nessuna prenotazione trovata');
                }
                else{
                        var ticket = result.rows[0];
			var title = ticket.title;
			var description = ticket.description;
			var quantity = ticket.quantity.split(';');
			var filename = '/tickets/' + token + '.png';
			qr.toFile(path + '/public' + filename,'https://www.cistoursroma.com/verify?id=' + id + '&token=' + token, function(err){
				ejs.renderFile(path + '/views/ticket.ejs', {img_path: 'file://' + path + '/public' + filename, title: title, description: description}, function(err, result){
					if(result){
						pdf.create(result).toFile(path + '/public/tickets/' + token + '.pdf', function(error, resultpdf){
							if(err){
								console.log('errore');
							}
							else{
								var accessToken = oauth2Client.getRequestHeaders();
								var transporter = mail.createTransport({11
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
									to: ticket.email,
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
