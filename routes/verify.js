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
        pool.query('SELECT * FROM payments, products_en WHERE payments.payment_id = $1 AND payments.book_token = $2 AND payments.product_id = products_en.product_id', [id, token], (error, result) => {
                if(error){
                        console.log(error);
                }
                if(result.rowCount == 0){
                        res.send('Ticket non valido');
                }
                else{
			res.send('Ticket valido');
                }
        });
});

module.exports = router;
