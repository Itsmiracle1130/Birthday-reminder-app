const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userModel = new Schema ({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	dob: {
		type: Date,
		required: true
	}
});

module.exports = mongoose.model(userModel);