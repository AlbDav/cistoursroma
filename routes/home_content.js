var express = require('express');
var router = express.Router();
var fs = require('fs');
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
	var num = req.query.num;
	var cat = req.query.cat;
	var cont = '';
	
	pool.query('SELECT * FROM categories WHERE category_id = $1', [cat], (err, result) => {
		var category = result.rows[0].name;
		cont += '<div class="slide_title">' + category + '</div>';
		pool.query('SELECT * FROM products, products_en, prices WHERE category = $1 AND products.product_id = products_en.product_id AND products.product_id = prices.product_id AND prices.option_num = 1 ORDER BY products.product_id', [cat], (err, result) => {
			var posts = result.rows;
			while(posts.length < num*3){
				num = num-1;
			}
			for(i = 0; i < 3; i++){
				if(i == 0){
					cont += '<div class="slide" style="display: block;">';
				}
				else{
					cont += '<div class="slide">';
				}
				cont += '<div class="table">';
				for(j = (i*num); j < (i*num)+parseInt(num); j++){
					var post = posts[j];
					cont += `<div class="prod">
					       		<div class="img" style="background-image: url(\'` + post['img'] + `\')"></div>
							<div class="title">` + post['title'] + `</div>`;
							if(post['price'] != null){
								cont += `<div class="price"><p>Prezzo Standard</p><p>` + post['price'] + `</p></div>`;
							}
							cont += `<button class="butt" onClick="location.href=\'/product/` + post['product_id'] + `\'">Read More</button>
						</div>`;
				}
				cont += '</div></div>';
			}
			res.send(cont);
		});
	});

});

module.exports = router;
