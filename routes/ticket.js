var express = require('express');
var router = express.Router();
var qr = require('qrcode');
var rand_str = require('randomstring');

/* GET home page. */
router.get('/', function(req, res, next) {
	var token = rand_str.generate();
	var filename = './public/' + token + '.png';
	qr.toFile(filename,'Questo è il ticket con token ' + token, function(err){
		console.log('done');
		res.render('ticket', {img_path: filename});
	});
});

module.exports = router;
