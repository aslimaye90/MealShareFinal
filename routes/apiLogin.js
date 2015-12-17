var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var personSchema = require('../MongoModels/persons.js');
var jwt = require('jsonwebtoken');
var config = require('../config');


router.post('/', function(req, res){
	if(!req.body.email || !req.body.password){
		res.statusCode = 400;
		res.json({"error": "insufficient data"});
		return;
	}

	personSchema.findOne(
		{
			"email": req.body.email,
			"password": req.body.password
		},
		{"password":0, "ratings":0, "creditCardNumber":0, "dateOfBirth":0, "contactNumbers":0, "__v":0},
		{},
		function(err,data){
			if(err){
				console.log(err);
				console.log('error checking email/password --> login');
				res.statusCode = 500;
				res.json({"error": "internal server error"});
				return;
			}

			if(!data){
				res.statusCode = 400;
				res.json({"error": "invalid email/password combination"});
				return;
			}
			
			data = JSON.parse(JSON.stringify(data));
			
			var token = jwt.sign(
                {
                    "userID": data._id
                },
                config.secret
            );

			var isCreditCard = true;
			if(data.creditCardNumber == parseInt('0123456789')){
				isCreditCard = false;
			}
			
            res.statusCode=200;
            res.json({"token": token, "isCreditCard": isCreditCard, "userDetails": data});
            return;
		}
	);
});

module.exports = router;