var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
	addressStreet1: {type: String, required: true},
	addressStreet2 : String,
	addressUnitNumber: String,
	addressCity: {type: String, required: true},
	addressState: {type: String, required: true},
	addressCountry: {type: String, required: true},
	addressZipcode: {type: Number, required: true}
});

module.exports = mongoose.model('addresses', addressSchema);