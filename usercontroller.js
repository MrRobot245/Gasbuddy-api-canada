// UserController.js

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));


// RETURNS ALL THE USERS IN THE DATABASE
router.get('/location/:id', function(req, res, next) {

	// res.locals.connection.query('SELECT * from users', function (error, results, fields) {
	// 	if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	// });
});
module.exports = router;
