var express = require('express');
var router = express.Router();
var qr = require('qrcode');

/* GET home page. */
router.get('/', function(req, res, next) {
	qr.toFile('./qr.png','Dico addio figlio tloooooia', function(err){
		console.log('done');
	});
});

module.exports = router;
