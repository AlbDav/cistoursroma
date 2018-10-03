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
	gateway.transaction.sale({
		amount: "10.00",
		paymentMethodNonce: paymentNonce,
		options: {
			submitForSettlement: true
		}
	}, function(err, result){
		console.log(result);
		res.send(result);
	});
});

module.exports = router;
