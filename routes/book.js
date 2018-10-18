var express = require('express');
var router = express.Router();
var rand_str = require('randomstring');
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

/* GET home page. */
router.post('/', function(req, res, next) {
	var id = req.body.id;
	var qt = req.body.qt;
	var date = new Date();
	var info = req.body.info;
	var token = rand_str.generate();
	var paid = 0;
	pool.query('INSERT INTO payments(product_id, quantity, tour_date, info, payment_token, paid) VALUES($1, $2, $3, $4, $5, $6)', [id, qt, date, info, token, paid], (err, result) => {
		if(err){
			console.log('error');
		}
		else{
			console.log(result);
			var accessToken = oauth2Client.getRequestHeaders()
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
				subject: 'Completa il pagamento',
				html: '<p>Clicca <a href="http://cistoursroma.com/payment?id=' + id + '">qui</a> per completare il pagamento</p>'
			};
			transporter.sendMail(mailOptions, function(err, info){
				if(err){
					conosle.log(err);
				}
				else{
					console.log(info);
				}
			});
		}
	});
});

module.exports = router;
