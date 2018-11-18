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
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	var phone = req.body.phone;
	var qt = req.body.qt;
	var date = req.body.date;
	var info = req.body.info;
	var token = rand_str.generate();
	var paid = 0;
	console.log(firstName);
	console.log(lastName);
	console.log(email);
	console.log(phone);
	pool.query('INSERT INTO payments(product_id, quantity, tour_date, info, book_token, email, paid) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [id, qt, date, info, token, email, paid], (err, result) => {
		if(err){
			console.log(err);
		}
		else{
			var payment_id = result.rows[0].payment_id;
//			var accessToken = oauth2Client.refreshAccessToken()
//				.then(res => res.credentials.access_token);
	var authHeaders = await oauth2Client.getRequestHeaders();
			/*var transporter = mail.createTransport({
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
				from: process.env.GMAIL_USER,
				to: email,
				subject: 'Completa il pagamento',
				html: '<p>Clicca <a href="http://cistoursroma.com/payment?id=' + payment_id + '&token=' + token + '">qui</a> per completare il pagamento</p>'
			};
			transporter.sendMail(mailOptions, function(err, info){
				if(err){
					console.log(err);
				}
				res.send("success");
			});*/
		}
	});
});

async function temp(){
	var authHeaders = await oauth2Client.getRequestHeaders();
	console.log(authHeaders);
}

module.exports = router;
