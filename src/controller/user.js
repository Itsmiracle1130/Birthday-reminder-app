const mongoose = require("mongoose");
require("dotenv").config();

// Define a model
const User = mongoose.model("User", {
	username: String,
	email: String,
	dob: Date,
	// Add other fields as needed
});

// Connect to the database
mongoose.connect("mongodb://localhost:27017/your_database", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Get the current date
const currentDate = new Date();

// Find users with the same DOB as the current date
User.find({
	$expr: {
		$and: [
			{ $eq: [{ $dayOfMonth: "$dob" }, { $dayOfMonth: currentDate }] },
			{ $eq: [{ $month: "$dob" }, { $month: currentDate }] },
		],
	},
}, (err, users) => {
	if (err) {
		console.error(err);
	} else {
		console.log(users);
	}

});
