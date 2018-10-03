var express = require('express');
var router = express.Router();
const {Pool} = require('pg');
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'postgres',
	port: 5432
});

/* GET home page. */
router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	
	pool.query('SELECT * FROM offers WHERE offer_id = $1', [id], (err, result) => {
		if(err){
			res.send('errore');
		}
		res.send(result.rows[0]);
	});
});

module.exports = router;
