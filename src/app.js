const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const {connectMongoDb} = require("./database/database");
const User = require("./models/user");
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
        
		const user = new User({
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

async function check (){
	const today = new Date();
	const currentMonth = today.getMonth() + 1;
	const currentDay = today.getDate();
	
	const celebrants = await User.aggregate([
		{
			$addFields: {
				dobMonth: { $month: "$dob" },
				dobDay: { $dayOfMonth: "$dob" }
			}
		},
		{
			$match: {
				dobMonth: currentMonth,
				dobDay: currentDay
			}
		}
	]);
	const celebrantsEmail = celebrants.map(celebrants => celebrants.email);
	const CelebrantsUsername = celebrants.map(celebrants => celebrants.username);

	return ({celebrantsEmail, CelebrantsUsername});
}


check()
	.then((extractedCelebrants) => {
		// console.log(extractedCelebrants.celebrantsEmail);
		
		//save admin details
		const admin = process.env.user;
		const adminPass = process.env.pwd;
		
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
					to: extractedCelebrants.celebrantsEmail,
					subject: "Birthday Wish from The Birthday reminder App",
					text: `Happy birthday ${extractedCelebrants.CelebrantsUsername}, \nJust testing this out for now`
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

		//Cron job configuration

		cron.schedule("0 7 * * *" , sendEmail);
		return extractedCelebrants;
	}).catch(status => {
		console.log(`An error ${status} occurred`);
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
