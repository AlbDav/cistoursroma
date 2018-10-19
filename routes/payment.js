var express = require('express');
var router = express.Router();
const {Pool} = require('pg');
const pool = new Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASS,
	port: process.env.PG_PORT
});

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
			var book = result.rows[0];
			var qt = book.quantity.split(';');
			pool.query('SELECT * FROM products_en, prices WHERE products_en.product_id = prices.product_id AND products_en.product_id = $1 ORDER BY prices.option_num', [book.product_id], (err, res_info) => {
				var info = res_info.rows;
				var price = 0;
				for(i = 0; i < qt.length; i++){
				      var qt_temp = parseInt(qt[i]);
				      var price_temp = parseFloat(info[i].price);
				      price = price + (qt_temp*price_temp);
				}
				res.send('prezzo:' + price);
				//res.render('payment');
			});
		}
	});
});

module.exports = router;
