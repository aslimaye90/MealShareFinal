var mongoose = require('mongoose');

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

var foodbankSchema = new mongoose.Schema({
    name: {type:String, required:true},
    websiteUrl: {type:String, required:true},
    email: {type:String, required:true, unique:true, trim:true, lowercase:true},
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
});

module.exports = mongoose.model('foodbanks', foodbankSchema);