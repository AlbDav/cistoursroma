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
router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	
	pool.query('SELECT * FROM products, products_en WHERE products.product_id = products_en.product_id AND products.product_id = $1', [id], (err, result) => {
		if(err){
			res.send('errore');
		}
		var product = result.rows[0];
		var includes = [];
		var hours;
		var days = '';
		if(product.included != null){
			includes = product.included.split(";");
		}
		if(product.days != null){
			var daysArray = product.days.split(";");
			for(i = 0; i < daysArray.length; i++){
				days += daysArray[i];
				if(i < daysArray.length-1){
					days += ', ';
				}
			}
		}
		pool.query('SELECT * FROM hours_lang WHERE product_id = $1', [id], (err, result) => {
			if(err){
				console.log(err);
			}
			else{
				for(i = 0; i < result.rows.length; i++){
					resTemp = result.rows[i];
					hours[resTemp.lang] = resTemp.hours.split(';');
				}
				console.log(hours);
			}
			pool.query('SELECT * FROM prices WHERE product_id = $1 ORDER BY option_num', [id], (err, result) => {
				if(err){
					res.send('errore');
				}
				var prices = result.rows;
				res.render('product', {product, prices, includes, hours, days});
			});
		});
	});
});

module.exports = router;
