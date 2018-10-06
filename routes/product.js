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
	
	pool.query('SELECT * FROM products WHERE product_id = $1', [id], (err, result) => {
		if(err){
			res.send('errore');
		}
		res.send(result.rows[0]);
	});
});

module.exports = router;
