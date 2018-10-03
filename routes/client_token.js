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
router.get('/', function(req, res, next) {
	var clientToken;
	gateway.clientToken.generate(function(err, response){
		clientToken = response.clientToken;
		res.send(clientToken);
	});
});

module.exports = router;
