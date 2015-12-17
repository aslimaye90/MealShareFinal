var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var mealsSchema = require('../../MongoModels/meals.js');


//  middleware to check existence of x-access-token
//  all routes after this will need the access token (bearer) in the header
router.use(function(req,res,next){
	var token = req.headers.bearer;
	if(!token){
		console.log('no token -->> 401');
		res.statusCode = 401;
		res.json({'err': 'please login to continue'});
		return;
	}

	jwt.verify(token, config.secret, function(err, decoded){
        if(err){
            console.log('token tampered!');
            res.statusCode = 401;
            res.json({"err": 'token tampered! please login again to continue'});
            return;
        }

        req.headers.userID = decoded.userID;
        next();
    });
});

/*GET all buyers for a given meal*/
//  only the meal seller has access to this route
router.get('/:MId', function(req, res){
	mealsSchema.findOne(
		{
			"_id": req.params.MId,
			"seller": mongoose.Types.ObjectId(req.headers.userID)
		},
		{"buyers":1},
		function(err, data){
			if(err){
				console.log('error getting meal buyers');
				console.log(err);
				res.statusCode = 500;
				res.send(err);
				return;
			}
			
			if(!data){
				console.log('buyers --> access only to seller');
				res.statusCode = 403;
				res.json({"err": "unauthorized"});
				return;
			}
			
			res.json(data);
	});
});


/*POST a new buyer to a meal*/
router.post('/:MId', function(req,res){
	
	if(!req.body.quantity || isNaN(parseInt(req.body.quantity))){
		console.log('quantity not present or invalid --> POST meal');
		res.statusCode = 400;
		res.json({"err": "'quantity' not present"});
		return;
	}
	
	try{
		mongoose.Types.ObjectId(req.params.MId);
	}
	catch(err){
		console.log('invalid MealID --> POST meal');
		res.statusCode = 400;
		res.json({"err": "invalid MealID"});
		return;
	}
	
	//check if this buyer already exists
	mealsSchema.findOne(
		{
			"_id": mongoose.Types.ObjectId(req.params.MId),
			"buyers.buyer": mongoose.Types.ObjectId(req.headers.userID)
		},
		{"_id":1},
		{},
		function(err,data){
			if(err){
				console.log(err);
				res.statusCode = 500;
				res.send(err);
				return;
			}
			
			if(!data){
				postNewBuyer();
			}
			else{
				console.log('buyer already exists!');
				res.statusCode = 401;
				res.send({'err': 'buyer already exists'});
				return;
			}
		}
	);
	
	function postNewBuyer(){
		
		var newBuyer = {
			"buyer": req.headers.userID,
			"quantity": parseInt(req.body.quantity)
		};
		
		mealsSchema.findOneAndUpdate(
			{
				"_id": mongoose.Types.ObjectId(req.params.MId),
				"availableSpots": {$gte: parseInt(req.body.quantity)},
				"seller": {$ne: mongoose.Types.ObjectId(req.headers.userID)}
			},
			{
				$push: {"buyers": newBuyer},
				$inc: {"availableSpots": -(parseInt(req.body.quantity))} 
			},
			{},
			function(err,data){
				if(err){
					console.log(err);
					res.statusCode = 500;
					res.send(err);
					return;
				}
				
				if(!data){
					console.log('invalid inputs --> POST meal');
					res.statusCode = 400;
					res.json({"err": "invalid inputs"});
					return;
				}
				
				res.json(data);
			}
		);
	}
});


//  DELETE a buyer from the given meal
//  (route will be used in cancel request)
//  only the buyer and the meal owener can use this route
router.delete('/:MId', function(req,res){
	mealsSchema.aggregate(
		[
			{$match: {"_id": mongoose.Types.ObjectId(req.params.MId)}},
			{$unwind: "$buyers"},
			{$match: {"buyers.buyer": mongoose.Types.ObjectId(req.headers.userID)}},
			{$project: {"buyers":1}}
		],
		function(err,data){
			if(err){
				console.log(err);
				res.statusCode = 500;
				res.send(err);
				return;
			}			
			
			if(Array.isArray(data) && data.length===0){
				res.statusCode = 403;
				res.json({"err": 'unauthorized!'});
				return;
			}
			
			var quantity = JSON.parse(JSON.stringify(data[0])).buyers.quantity;
			
			//  now do the update
			mealsSchema.findOneAndUpdate(
				{"_id": mongoose.Types.ObjectId(req.params.MId)},
				{
					$pull: {"buyers": {"buyer": mongoose.Types.ObjectId(req.headers.userID)}},
					$inc: {"availableSpots": (parseInt(quantity))}
				},
				{new: true},
				function(err, data){
				    if(err){
				    	console.log(err);
				    	res.statusCode = 500;
				    	res.send(err);
				    	return;
				    }
				    
				    res.json(data);
				    return;
				}
			);
		}
	);
});

module.exports = router;