const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const nodemailer = require("nodemailer");
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

//save admin details
const admin = process.env.user;
const adminPass = process.env.pwd;
const reciever = process.env.email;

//send email setup
function sendEmail (){

	return new Promise((resolve, reject) => {

		var transporter = nodemailer.createTransport({
			service: "gmail.com",
			auth:{
				user: admin,
				pass: adminPass
			}
		});

		const mail_configs = {
			from: admin,
			to: reciever,
			subject: "Birthday Wish from The Birthday reminder App",
			text: "Just testing this out for now"
		};
		transporter.sendMail(mail_configs, function(error, info){
			if (error){
				console.log(error);
				return reject({message: "An error has occured"});
			}
			return resolve({message: "Email sent successfully"});
		});
	});
}

app.get("/sendEmail", (req, res) => {
	// const {name} = req.query;
	sendEmail()
		.then((response) => res.send(response.message))
		.catch((error) => res.status(500).send(error.message));
});

//Check database for celebrant
function checkForCelebrant (){

}

// function task () {
// 	console.log("I am asked to print this every minute");
// }

// cron.schedule("* * * * *" , task);
// cron.schedule("* * * * *" , sendEmail);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
