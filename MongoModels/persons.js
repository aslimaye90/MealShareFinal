var mongoose = require('mongoose');
//var mongoosastic = require('mongoosastic');
var addressSchema = require('../MongoModels/addresses.js');

var ratingsSchema = new mongoose.Schema({
  review: String,
  rating: {type: Number, min: 1, max: 5, required: true},
  ratedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'persons',
    required: true
  },
  ratedOn: {type: Date, required: true}
});

var personSchema = new mongoose.Schema({
  email: {type:String, required:true, unique:true, trim:true, lowercase:true},
  password: {type: String, required: true},
  firstName: {type: String, required: true, es_indexed:true},
  lastName: {type: String, required: true, es_indexed:true},
  creditCardNumber: Number,
  dateOfBirth: Date,
  address: String,
  contactNumber: Number,
  ratings: [ratingsSchema],
  photoUrl: String,
  averageRating: Number,
  headline: String
});


/*personSchema.plugin(mongoosastic, {
  host: 'localhost',
  port: 9200,
  protocol: 'http',
  index: 'mealshare',
  type: 'persons'
});*/


var persons = mongoose.model('persons', personSchema);

/*persons.createMapping(function(err,mapping){
  if(err){
    console.log(err);
    return;
  }
  console.log(mapping);
});*/


//only ADDS new items from MongoDB, DOES NOT delete extra ones from es
/*var stream = persons.synchronize();
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


module.exports = persons;