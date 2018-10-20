var express = require('express');
var router = express.Router();
var braintree = require('braintree');
var gateway = braintree.connect({
	environment:  braintree.Environment.Sandbox,
	merchantId:   process.env.BRAIN_MERCH_ID,
	publicKey:    process.env.BRAIN_PUB,
	privateKey:   process.env.BRAIN_PRIV
});

/* GET users listing. */
router.post('/', function(req, res, next) {
	var paymentNonce = req.body.payment_method_nonce;
        var id = req.body.id;
        var token = req.body.token;

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
				if(err){
					console.log('err');
				}
                                var info = res_info.rows;
                                var price = 0;
                                for(i = 0; i < qt.length; i++){
                                      var qt_temp = parseInt(qt[i]);
                                      var price_temp = parseFloat(info[i].price);
                                      price = price + (qt_temp*price_temp);
                                }
				gateway.transaction.sale({
					amount: price,
					paymentMethodNonce: paymentNonce,
					options: {
						submitForSettlement: true
					}
				}, function(tr_err, tr_result){
					if(err){
						console.log('err');
					}
					console.log(tr_result);
					res.send(tr_result);
				});
                        });
                }
        });
});

module.exports = router;
