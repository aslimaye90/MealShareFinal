var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var elasticsearch = require('elasticsearch');
//var mongoosastic = require('mongoosastic');
var personSchema = require('../MongoModels/persons.js');
var mealSchema = require('../MongoModels/meals.js');

/*var client = new elasticsearch.Client({
	host: 'localhost:9200'
});*/

/*GET all persons*/
router.get('/:searchString', function(req, res){
	
	mealSchema.find(
		{ $or:
			[
				{'title':new RegExp(req.params.searchString, "i")},
				{'description':new RegExp(req.params.searchString, "i")},
			]
		}
	)
	.populate('seller', 'firstName lastName')
	.exec(function(err,data){
		if(err){
			res.send(err);
		}
		else{
			res.send(data);
		}
	});
});

module.exports = router;