const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cron = require("node-cron");
const {connectMongoDb} = require("./database/database");
const userModel = require("./models/user");
require("dotenv").config();

const app = express();

//connect to mongoDB
connectMongoDb();

//security
app.use(helmet());

// Set up EJS as the view engine
app.set("view engine", "ejs");

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route to render the form
app.get("/form", (req, res) => {
	res.render("form");
});

// Route to handle form submission
app.post("/submit", async (req, res) => {
	const { dob, email, username } = req.body;
	const lowercaseUsername = username.toLowerCase();
	const lowercaseEmail = email.toLowerCase();

	try {
        
		const user = new userModel({
			dob,
			email: lowercaseEmail,
			username: lowercaseUsername
		});
		await user.save();
		res.render("submitted", { dob, email :lowercaseEmail, username: lowercaseUsername });
	} catch (error) {
		console.error("Error saving to the database:", error);
		res.status(500).send("Internal Server Error");
	}
});

function task () {
	console.log("I am asked to print this every minute");
}

cron.schedule("* * * * *" , task);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
