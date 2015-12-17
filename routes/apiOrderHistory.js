var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config');
var mealsSchema = require('../MongoModels/meals.js');
var personSchema = require('../MongoModels/persons.js');


//  middleware to check existence of x-access-token
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


router.get('/myorders', function(req, res){
    
    mealsSchema.aggregate(
        [
            {$unwind: "$buyers"},
            {$match: {"buyers.buyer": mongoose.Types.ObjectId(req.headers.userID)}},
            {$group: {
                "_id": "$_id",
                "buyers": {$push: "$buyers"},
                "title": {$first: "$title"},
                "seller": {$first: "$seller"},
                "availableSpots": {$first: "$availableSpots"},
                "price": {$first: "$price"},
                "imageID": {$first: "$imageID"},
                "startDateTime": {$first: "$startDateTime"}
                }
            }
        ],
        function(err, data){
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send(err);
                return;
            }
            
            if(!data){
                res.send(data);
                return;
            }
            
            personSchema.populate(data, {path:'seller', select:'firstName lastName'}, function(err, data){
                if(err){
                    console.log(err);
                    res.statusCode = 500;
                    res.send(err);
                    return;
                }
                
                res.send(data);
            });
        }
    );
    
});


module.exports = router;