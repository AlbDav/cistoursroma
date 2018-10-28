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
	res.render('contacts');
});

module.exports = router;
