const joi = require("joi");

const schema = joi.object({
	username: joi.string()
		.min(2)
		.max(250)
		.required()
		.unique(),
	email: joi.string()
		.email()
		.max(250)
		.required()
		.unique(),
	dob: joi.date()
		.format("DD-MM-YYYY")
		.required()
});


async function validateUserInfo (req, res, next) {
	const userinfo = req.body;

	try {
		await schema.validateAsync(userinfo);
		next();
	} catch (error) {
		return ({
			message: error.details[0].message,
			status: 400
		});
	}
}

module.exports = {validateUserInfo};