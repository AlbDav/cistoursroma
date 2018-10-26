var express = require('express');
var router = express.Router();
var fs = require('fs');
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
	
	pool.query('SELECT * FROM categories WHERE category_id = $1', [id], (err, result) => {
		var category = result.rows;
		pool.query('SELECT * FROM products, products_en, prices WHERE category = $1 AND products.product_id = products_en.product_id AND products.product_id = prices.product_id AND prices.option_num = 1 ORDER BY products.product_id', [id], (err, result) => {
			var posts = result.rows;
			res.render('category', {category, products});
		});
	});

});

module.exports = router;
