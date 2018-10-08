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
		res.send(product);
		//res.render('product', {product});
	});
});

module.exports = router;
