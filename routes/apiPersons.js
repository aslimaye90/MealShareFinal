var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var elasticsearch = require('elasticsearch');
var personSchema = require('../MongoModels/persons.js');

/*var client = new elasticsearch.Client({
	host: 'localhost:9200'
});*/

/*GET all persons*/
router.get('/', function(req, res){
	personSchema.find(function(err, data){
		if(err){
			console.log('error getting all persons: '+err);
			console.log(err);
			res.send(err);
			return;
		}
		res.json(data);
	});
});

/*GET a single OR few persons*/
router.get('/:param', function(req, res){
	var array = req.params.param.split(",");
	//for getting a single meal
	if(array.length==1){
		personSchema.findOne({"_id": array[0]})
		.populate('ratings.ratedBy', 'firstName lastName email')
		.exec(function(err, data){
			if(err){
				console.log('error GETting a single person');
				console.log(err);
				res.send(err);
				return;
			}
			res.json(data);
		});
	}
	//for getting multiple (could be all) persons
	else{
		personSchema.find(
			{"_id": {$in: array}},
			function(err, data){
				if(err){
					console.log('error GETting multiple persons');
					console.log(err);
					res.send(err);
					return;
				}
				res.json(data);
			}
		);
	}
});

/*POST a single person*/
router.post('/', function(req,res){

	if(!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName){
		console.log('insufficient data');
		res.statusCode = 400;
		res.json({"error": "insufficient data"});
		return;
	}

	var person = {
		email: req.body.email,
		password: req.body.password,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		creditCardNumber: parseInt(req.body.creditCardNumber) || parseInt('0123456789'),
		dateOfBirth: new Date("1990-10-10T00:00:00Z"),
		adresses: req.body.address || '',
		contactNumbers: parseInt(req.body.contactNumber) || parseInt('1112223333'),
		ratings: [],
		photoUrl: req.body.photoUrl || 'http://telangaananriforum.org/wp-content/plugins/our-team-enhanced/inc/img/noprofile.jpg',
		averageRating: 0,
		headline: ''
	};
	if(req.body.dateOfBirth){
		person.dateOfBirth = new Date(req.body.dateOfBirth);
	}

	var item = new personSchema(person);
	item.save(function(err, status){
		if (err){
			console.log('error adding a new person to DB');
			console.log(err);
			res.statusCode = 500;
			res.send(err);
			return;
		}
		console.log("added a new person to DB");
		res.json({"added-new-person": status});
	});
});

/*PUT (edit) a person - except contact, addresse & ratings*/
/*nested items (nested arrays) have a different route*/
/*use those routes to edit arrays*/
router.put('/:Pid', function(req, res){
	
	try{
		mongoose.Types.ObjectId(req.params.Pid);
	}
	catch(err){
		console.log('invalid userID');
		res.statusCode = 400;
		res.json({'err': 'invalid userID'});
		return;
	}
	
	var setThese = {};
	
	if(req.body.email){
		setThese.email = req.body.email;
	}
	if(req.body.firstName){
		setThese.firstName = req.body.firstName;
	}
	if(req.body.lastName){
		setThese.lastName = req.body.lastName;
	}
	if(req.body.creditCardNumber){
		setThese.creditCardNumber = req.body.creditCardNumber;
	}
	if(req.body.dateOfBirth){
		setThese.dateOfBirth = new Date(req.body.dateOfBirth);
	}
	if(req.body.photoUrl){
		setThese.photoUrl = req.body.photoUrl;
	}
	if(req.body.headline){
		setThese.headline = req.body.headline;
	}
	
	personSchema.findOneAndUpdate(
		{"_id": mongoose.Types.ObjectId(req.params.Pid)},
		{$set: setThese},
		{new:true, upsert:false},
		function(err,data){
			if(err){
				console.log('error PUTting a Person');
				console.log(err);
				res.statusCode = 500;
				res.send(err);
				return;
			}
			
			res.json(data);
		}
	);
});

/*DELETE a person*/
router.delete('/:PId', function(req, res){
	personSchema.remove({"_id": req.params.PId}, function(err,data){
		if(err){
			console.log("error removing a person");
			console.log(err);
			res.send(err);
			return;
		}

		/*client.delete(
			{
				index: 'mealshare',
				type: 'persons',
				id: String(req.params.PId)
			},
			function(err, res){
				if(err){
					console.log('es delete error:\n'+err);
					return;
				}
				console.log(res);
			}
		);*/

		res.json({"removed": req.params.PId});
	});
});

module.exports = router;