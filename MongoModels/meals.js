var mongoose = require('mongoose');
var searchPlugin = require('mongoose-search-plugin');
//var mongoosastic = require('mongoosastic');
var addressSchema = require('../MongoModels/addresses.js');

var buyerSchema = new mongoose.Schema({
	buyer: {
		type: mongoose.Schema.ObjectId,
	    ref: 'persons'
	},
	quantity: Number
});

var foodItemSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	ingredients: [{
		name: {type: String, required: true},
		description: String
	}]
});

var mealSchema = mongoose.Schema({
	//title: {type: String, required: true, es_indexed:true},
	//description: {type: String, es_indexed:true},
	title: {type: String, required: true},
	description: {type: String},
	mealAddress: {type: String, required: true},
	//  saved as [longitude, latitude] --> array of length 2 = [22,11]
	location: {type: [Number], index: '2dsphere', required: true},
	price: {type: Number, required: true},
	imageID: String,
	seller: {
		type: mongoose.Schema.ObjectId,
	    ref: 'persons',
	    required: true
	},
	foodItems: [foodItemSchema],
	buyers: [buyerSchema],
	availableSpots: {type: Number, required: true},
	cuisines: [{
		name: {type: String, required: true},
		description: String
	}], 
	startDateTime: {type: Date, required: true},
	endDateTime: {type: Date, required: true},
	//  food category info
	isVegan: Boolean,
	isVegetarian: Boolean,
	isGlutenFree: Boolean,
	isToGo: Boolean,
	isEatHere: Boolean,
	//  allergen info
	isPeanut: Boolean,
	isTreenut: Boolean,
	isEgg: Boolean,
	isWheat: Boolean,
	isMilk: Boolean,
	isFish: Boolean,
	isSoy: Boolean,
});


mealSchema.plugin(searchPlugin, {
	fields: ['title', 'description']
});

//mealSchema.index({index: 'text'});
/*mealSchema.plugin(mongoosastic, {
  host: 'localhost',
  port: 9200,
  protocol: 'http',
  index: 'mealshare',
  type: 'meals'
});*/


var meals = mongoose.model('meals', mealSchema);

//  do this only first time (to init keywords for existing documents)
/*meals.setKeywords(function(err) {
	// ... 
});*/

/*meals.createMapping(function(err,mapping){
	if(err){
		console.log(err);
		return;
  	}
  	console.log(mapping);
});*/

//only ADDS new items from MongoDB, DOES NOT delete extra ones from es
/*var stream = meals.synchronize();
var count=0;
stream.on('data', function(err, doc){
  count++;
});
stream.on('close', function(){
  console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err){
  console.log(err);
});*/

module.exports = meals;