const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema ({
	name: {type: String, required: true},
	email: {type: String, required: true},
	phone: {type: Number, required: true},
	pickupDate: {type: Date, required: true},
	pickupTime: {type: String, required: true},
	cakeServings: {type: Number},
	cupcakeServings: {type: Number},
	cakeFlavor: {type: String},
	frostingFlavor: {type: String},
	decoration: {type: String},
	message: {type: String},
	requests: {type: String},
	submissionDate: {type: Date, default: new Date(), required: true}
})

const Orders = mongoose.model('Orders', ordersSchema);

module.exports = {Orders};