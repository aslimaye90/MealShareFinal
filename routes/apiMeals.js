var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var config = require('../config');
var upload = multer(
	{
	    dest:'uploads/'
	}
);

//var elasticsearch = require('elasticsearch');
var mealsSchema = require('../MongoModels/meals.js');

/*var client = new elasticsearch.Client({
	host: 'localhost:9200'
});*/

/*GET all meals*/
router.get('/', function(req, res){
	if(req.query.longitude && req.query.latitude){
		mealsSchema.where('location').near({
			center: [parseFloat(req.query.longitude), parseFloat(req.query.latitude)],
			spherical: true
		})
		.populate('seller', 'firstName lastName')
		.exec(function(err,data){
			if(err){
				console.log(err);
				res.statusCode = 500;
				res.send(err);
				return;
			}
			
			res.json(data);
		});
	}
	else{
		mealsSchema.find()
		.populate('seller', 'firstName lastName')
		.exec(function(err, data){
			if(err){
				console.log('error getting meals: '+err);
				console.log(err);
				res.send(err);
				return;
			}
			res.json(data);
		});	
	}
});

/*GET a single OR few meals*/
router.get('/:param', function(req, res){
	var array = req.params.param.split(",");
	//for getting a single meal
	
	mealsSchema.find(
		{"_id": {$in: array}},
		{},
		{}
	)
	.populate('seller')
	.exec(function(err,data){
		if(err){
			console.log('error getting meals');
			console.log(err);
			res.statusCode = 500;
			res.send('internal server error');
			return;
		}
		
		if(Array.isArray(data) && data.length==1)
			data = data[0];
		
		res.json(data);
		}
	);
});



/*PUT (edit) a meal - except mealAddress, buyers & cuisines*/
/*nested items (nested arrays) have a different route*/
/*use those routes to edit arrays*/
router.put('/:Mid', function(req, res){
	mealsSchema.findById(req.params.Mid, function(err, meal){
			if(err){
				console.log('error PUTting new meal');
				console.log(err);
				res.send(err);
				return;
			}

			if(req.body.title){
				meal.title = req.body.title;
			}
			if(req.body.seller){
				meal.seller = req.body.seller;
			}
			if(req.body.availableSpots){
				meal.availableSpots = req.body.availableSpots;
			}
			if(req.body.startDateTime){
				meal.startDateTime = new Date(req.body.startDateTime);
			}
			if(req.body.endDateTime){
				meal.endDateTime = new Date(req.body.endDateTime);
			}

			meal.save(function(err, data){
				if(err){
					console.log('error PUTting new Meal');
					console.log(err);
					res.send(err);
					return;
				}
				res.json({"modified": req.params.Mid});
			});
		}
	);
});


/*DELETE a meal*/
router.delete('/:MId', function(req, res){
	mealsSchema.findByIdAndRemove(
		{"_id": mongoose.Types.ObjectId(req.params.MId)},
		function(err,data){
			if(err){
				console.log(err);
				res.statusCode = 500;
				res.send(err);
				return;
			}
			
			var path = String(__dirname).slice(0,-6) + 'uploads/' + String(data.imageID);
			fs.unlink(path, function(){});
			
			res.json({"removed": data});
			return;
		}
	);
	
	/*mealsSchema.remove({"_id": req.params.MId}, function(err, data){
		if(err){
			console.log('error deleting a meal');
			console.log(err);
			res.send(err);
			return;
		}

		client.delete(
			{
				index: 'mealshare',
				type: 'meals',
				id: String(req.params.MId)
			},
			function(err, res){
				if(err){
					console.log('es delete error:\n'+err);
					return;
				}
				console.log(res);
			}
		);

		res.json({"removed-meal":data});
	});*/
});


//  middleware to check existence of x-access-token
//  all routes after this will need the access token (beared) in the header
router.use(function(req,res,next){
	var token = req.headers.bearer;
	if(!token){
		console.log('no token -->> 401');
		res.statusCode = 401;
		res.send('please login to continue');
		return;
	}

	jwt.verify(token, config.secret, function(err, decoded){
        if(err){
            console.log('token tampered!');
            res.statusCode = 401;
            res.send('token tampered! please login again to continue');
            return;
        }

        req.headers.userID = decoded.userID;
        next();
    });
});


/*POST a single meal*/
router.post('/', function(req,res,next){
	upload.single('image')(req, res, function(err){
		if (err) {
			console.log('in error');
			console.log(err);
			res.send(err);
			return;
		}
		
		if(!req.body.title || !req.body.mealAddress || !req.body.availableSpots ||
		   !req.body.startDateTime || !req.body.endDateTime || !req.body.price ||
		   !req.file){
			res.statusCode = 400;
			console.log('insufficient data to post meal');
			res.send('insufficient data');
			return;
		}
		
		
		//  this is (longitude, latitude)
		//  set to "san jose" by default
		var locArray = [parseFloat("-122.0975973"), parseFloat("37.2966853")];

		if(req.query.latitude && req.query.longitude){
			locArray[0] = parseFloat(req.query.longitude);
			locArray[1] = parseFloat(req.query.latitude);
		}

		var meal = {
			
			//  mandatory fields
			title: req.body.title,
			seller: req.headers.userID,
			availableSpots: req.body.availableSpots,
			startDateTime: new Date(req.body.startDateTime),
			endDateTime: new Date(req.body.endDateTime),
			mealAddress: req.body.mealAddress,
			location: locArray,
			price: parseFloat(req.body.price),
			
			//  optional fields
			imageID: req.file.filename || '',
			description: req.body.description || '',
			isVegan: req.body.isVegan || false,
			isVegetarian: req.body.isVegetarian || false,
			isGlutenFree: req.body.isGlutenFree || false,
			isToGo: req.body.isToGo || false,
			isEatHere: req.body.isEatHere || false,
			cuisines: [],
			buyers: [],
			foodItems: [],
			isPeanut: req.body.isPeanut || true,
			isTreenut: req.body.isTreenut || true,
			isEgg: req.body.isEgg || true,
			isWheat: req.body.isWheat || true,
			isMilk: req.body.isMilk || true,
			isFish: req.body.isFish || true,
			isSoy: req.body.isSoy || true
		};

		var item = new mealsSchema(meal);
		item.save(function(err, status){
			if (err){
				console.log('error adding a new meal');
				console.log(err);
				res.statusCode = 500;
				res.send(err);
				return;
			}
			console.log("added a new meal");
			res.json({"added-new-meal": status});
		});
	});
});

module.exports = router;