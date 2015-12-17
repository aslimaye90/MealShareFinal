var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var personSchema = require('../../MongoModels/persons.js');



//  GET all reviews for a given person
//  visibile to all
router.get('/:PId', function(req, res){
	
	try{
		mongoose.Types.ObjectId(req.params.PId)
	}
	catch(err){
		console.log('invalid PID');
		res.statusCode = 400;
		res.json({err: 'invalid user ID'});
		return;
	}
	
	personSchema.findOne(
		{
			"_id": mongoose.Types.ObjectId(req.params.PId)
		},
		{"ratings":1},
		function(err, data){
			if(err){
				console.log('error getting meal buyers');
				console.log(err);
				res.statusCode = 500;
				res.send(err);
				return;
			}
			
			res.json(data);
	});
});



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



//  POST a new review to a person
//  validation for right to add review on front end
router.post('/:PId', function(req,res){
	
	if(!req.body.review || !req.body.rating || isNaN(parseInt(req.body.rating))){
		console.log('insufficient data');
		res.statusCode = 400;
		res.json({"err": "insufficient data"});
		return;
	}
	
	if(req.params.PId == req.headers.userID){
		console.log('cannot post review for yourself');
		res.statusCode = 401;
		res.json({err:'cannot post review for yourself'});
		return;
	}
	
	try{
		mongoose.Types.ObjectId(req.params.PId);
	}
	catch(err){
		console.log('invalid userID --> POST review');
		res.statusCode = 400;
		res.json({"err": "invalid userID"});
		return;
	}
	
	//check if this person has already written a review
	personSchema.findOne(
		{
			"_id": mongoose.Types.ObjectId(req.params.PId),
			"ratings.ratedBy": mongoose.Types.ObjectId(req.headers.userID)
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
				postNewReview();
			}
			else{
				console.log('person has already written a review');
				res.statusCode = 401;
				res.send({'err': 'review already posted'});
				return;
			}
		}
	);
	
	function postNewReview(){
		
		var newReview = {
			review: req.body.review,
			rating: parseInt(req.body.rating),
			ratedBy: req.headers.userID,
			ratedOn: new Date()
		};
		
		personSchema.findOneAndUpdate(
			{
				"_id": mongoose.Types.ObjectId(req.params.PId)
			},
			{
				$push: {"ratings": newReview}
			},
			{new:true, upsert:false},
			function(err,data){
				if(err){
					console.log(err);
					res.statusCode = 500;
					res.send(err);
					return;
				}
				
				data = JSON.parse(JSON.stringify(data));
				var avg = 0;
				for(var i in data.ratings){
					avg += data.ratings[i].rating;
				}
				avg = avg/data.ratings.length;
				
				personSchema.findOneAndUpdate(
					{
						"_id": mongoose.Types.ObjectId(req.params.PId)
					},
					{
						$set: {"averageRating": avg}
					},
					{new:true, upsert:false},
					function(err, data){
					    if(err){
							console.log(err);
							res.statusCode = 500;
							res.send(err);
							return;
						}
						
						res.json(data);
					}
				);
			}
		);
	}
});


//  DELETE a review for the given person
//  only the reviewer (logged in person) can remove his own review
router.delete('/:PId', function(req,res){
	
	try{
		mongoose.Types.ObjectId(req.params.PId);
	}
	catch(err){
		console.log('invalid userID');
		res.statusCode = 400;
		res.json({err: 'invalid userID'});
		return;
	}
	
	personSchema.findOneAndUpdate(
		{"_id": mongoose.Types.ObjectId(req.params.PId)},
		{$pull: {"ratings": {"ratedBy": req.headers.userID}}},
		{new:true, upsert:false},
		function(err, data) {
		    if(err){
				console.log(err);
				res.statusCode = 500;
				res.send(err);
				return;
			}
			
			res.json(data);
		}
	);
});

module.exports = router;