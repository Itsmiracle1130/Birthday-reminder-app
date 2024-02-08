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

// const currentTime = new Date();
// const day = currentTime.getDate();
// const month = currentTime.getMonth() + 1; 
// const year = currentTime.getFullYear();
// const currentDate = (`${year}-${month}-${day}`);

// const findBirthday = userModel.find({ dob: currentDate });

module.exports = mongoose.model("User", userModel);