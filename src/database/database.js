const mongoose = require("mongoose");

require("dotenv").config();
const MONGO_URL = process.env.MONGODB_URL;

function connectMongoDb() {
	mongoose.connect(MONGO_URL);

	mongoose.connection.on("connected", () => {
		console.log("MongoDB database connected successfully");
	});

	mongoose.connection.on("error", (err) => {
		console.log(`An error occured while connecting to mongoDB ${err}`);
	});
}

module.exports = {connectMongoDb};






// , { useNewUrlParser: true, useUnifiedTopology: true }