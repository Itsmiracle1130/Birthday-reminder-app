const {validateUserSignupDetails, validateUserLoginDetails} = require('../validation/user')
const models = require('../models/user')

const userSignup = async (req, res) => {
	try {
		const { error, value } = validateUserSignupDetails(req.body);
		if(error) {
			return res.status(400).send({
				status: false,
				message: error.message
			});
		}
		const existingUser = await models.findOne({
			$or: [{
				email: value.email
			}, {
				username: value.username
			}]
		});
		if(existingUser) {
			return res.status(409).send({
				status: false,
				message: "Account already exist"
			});
		}
		
		const hashedPassword = await bcrypt.hash(value.password, 10);
		const createdUser = await models.user.create({
			firstName: value.firstName,
			lastName: value.lastName,
			email: value.email,
			username: value.username,
			password: hashedPassword
		});
		return res.status(201).render("login", ({
			createdUser
		}));
	} catch (error) {
		console.error(error.message);
		return res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};