var express = require('express');
var router = express.Router();
var qr = require('qrcode');
var rand_str = require('randomstring');
var ejs = require('ejs');
var pdf = require('html-pdf');

/* GET home page. */
router.get('/', function(req, res, next) {
	var path = process.env.PATH_TO_PROJECT;
	var token = rand_str.generate();
	var filename = '/tickets/' + token + '.png';
	qr.toFile(path + '/public' + filename,'Questo è il ticket con token ' + token, function(err){
		console.log('img done');
		ejs.renderFile(path + '/views/ticket.ejs', {img_path: filename}, function(err, result){
			if(result){
				console.log('ciao');
				res.send(result);
				pdf.create(result).toFile(path + '/public/tickets/' + token + '.pdf', function(error, resultpdf){
					if(err){
						console.log('errore');
					}
					else{
						console.log(resultpdf);
						res.send('ciao')
					}
				});
			}
		});	
	});
});

module.exports = router;
