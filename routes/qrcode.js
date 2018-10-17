var express = require('express');
var router = express.Router();
var qr = require('qrcode');

/* GET home page. */
router.get('/', function(req, res, next) {
	qr.toDataURL('Dico addio figlio tloooooia', function(err, url){
		console.log(url);
		res.send(url);
	});
});

module.exports = router;
