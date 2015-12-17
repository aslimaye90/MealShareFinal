var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var foodbankSchema = require('../MongoModels/foodbanks.js');
var config = require('../config');

/*foodbank schema

email: {type: String, required: true},
password: {type: String, required: true},
isPickUpAvailable: {type:Boolean, required:true},
acceptedItems: {
    cannedFood: Boolean,
    farmProduce: Boolean,
    preparedFood: Boolean,
    grocery: Boolean,
    other: String
},
hoursOfOperation:{
    start: Date,
    end: Date,
    days: [String]
},

address: String,
contactNumber: Number,
ratings: [ratingsSchema],
photoUrl: String,
averageRating: Number,
headline: String
*/    
    
//  GET all foodbanks
router.get('/', function(req,res){
    foodbankSchema.find(
        {},
        {'password':0},
        {},
        function(err,data){
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.json({'err': err});
                return;
            }
            
            res.json(data);
        }
    );
});


//  GET one foodbanks
router.get('/:FBID', function(req,res){
    try{
        mongoose.Types.ObjectId(req.params.FBID)
    }
    catch(err){
        console.log('invalid foodbank ID');
        res.statusCode = 400;
        res.json({err:'invalid foodbank ID'});
        return;
    }
    
    foodbankSchema.findOne(
        {"_id": mongoose.Types.ObjectId(req.params.FBID)},
        {'password':0},
        {},
        function(err,data){
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.json({'err': err});
                return;
            }
            
            res.json(data);
        }
    );
});


//  POST a new foodbank
router.post('/', function(req,res){
    if(!req.body.email || !req.body.password || !req.body.name ||
        !req.body.websiteUrl || !req.body.contactNumber || !req.body.address){
        console.log('insufficient data');
        res.statusCode = 400;
        res.json({err:'insufficient data'});
        return;
    }
    
    var newFoodBank = {
        address: req.body.address,
        contactNumber: parseInt(req.body.contactNumber),
        websiteUrl: req.body.websiteUrl,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isPickUpAvailable: 'true'==req.body.isPickUpAvailable?true:false,
        acceptedItems: {
            cannedFood: 'true'==req.body.cannedFood?true:false,
            farmProduce: 'true'==req.body.farmProduce?true:false,
            preparedFood: 'true'==req.body.preparedFood?true:false,
            grocery: 'true'==req.body.grocery?true:false,
            other: req.body.other || ''
        },
        hoursOfOperation:{
            start: req.body.start?new Date(req.body.start):new Date('2015-11-11T10:00:00Z'),
            end: req.body.end?new Date(req.body.end):new Date('2015-11-11T18:00:00Z'),
            days: req.body.days?String(req.body.days).split(' '):['mo', 'tu', 'we', 'th', 'fr', 'sa']
        },
        
        address: req.body.address || '',
        ratings: [],
        photoUrl: req.body.photoUrl || '',
        averageRating: parseInt('0'),
        headline: req.body.headline || ''
    };
    
    var item = new foodbankSchema(newFoodBank);
    item.save(function(err,data){
        if(err){
            console.log(err);
            res.statusCode = 500;
            res.json({'err':err});
            return;
        }
        
        res.send(data);
    });
});


//  PUT (edit) the given foodbank
router.put('/:FBID', function(req,res){
    try{
        mongoose.Types.ObjectId(req.params.FBID)
    }
    catch(err){
        console.log('invalid foodbank ID --> PUT');
        res.statusCode = 400;
        res.json({err: 'invalid foodbank ID'});
        return;
    }
    
    var setThese = {};
    
    if(req.body.password){
        setThese.password = req.body.password;
    }
    if(req.body.isPickUpAvailable){
        setThese.isPickUpAvailable = 'true'==req.body.isPickUpAvailable?true:false;
    }
    if(req.body.cannedFood){
        setThese.acceptedItems.cannedFood = 'true'==req.body.cannedFood?true:false;
    }
    if(req.body.farmProduce){
        setThese.acceptedItems.farmProduce = 'true'==req.body.farmProduce?true:false;
    }
    if(req.body.preparedFood){
        setThese.acceptedItems.preparedFood = 'true'==req.body.preparedFood?true:false;
    }
    if(req.body.grocery){
        setThese.acceptedItems.grocery = 'true'==req.body.grocery?true:false;
    }
    if(req.body.other){
        setThese.acceptedItems.other = req.body.other;
    }
    if(req.body.address){
        setThese.address = req.body.address;
    }
    if(req.body.contactNumber){
        setThese.contactNumber = parseInt(req.body.contactNumber);
    }
    if(req.body.photoUrl){
        setThese.photoUrl = req.body.photoUrl;
    }
    if(req.body.headline){
        setThese.headline = req.body.headline;
    }
    
    foodbankSchema.findOneAndUpdate(
        {"_id": mongoose.Types.ObjectId(req.params.FBID)},
        {$set: setThese},
        {new:true, upsert:false},
        function(err,data){
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.json({'err':err});
                return;
            }
            
            res.send(data);
        }
    );
});


//  DELETE a foodbank
router.delete('/:FBID', function(req,res){
    try{
        mongoose.Types.ObjectId(req.params.FBID)
    }
    catch(err){
        console.log('invalid foodbankID --> DELETE');
        res.statusCode = 400;
        res.json({err:'invalid foodbankID'});
        return;
    }
    
    foodbankSchema.remove(
        {"_id": mongoose.Types.ObjectId(req.params.FBID)},
        function(err,data){
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.json({'err':err});
                return;
            }
            
            res.send(data);
        }
    );
});

module.exports = router;