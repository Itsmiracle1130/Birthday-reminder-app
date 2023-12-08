const joi = require("joi");

const options = {
	stripUnknown: true,
	abortEarly: false,
	errors: {
		wrap: {
			label: ""
		}
	}
};

const validateUserSignupDetails = (userInfo) => {
	const schema = joi.object({
		username: joi.string().min(6).max(20).required(),
		email: joi.string().email().min(7).max(30).required(),
		dob: joi.date().format("DD-MM-YYYY").required()
	});
	return schema.validate(userInfo, options);
};
const validateUserLoginDetails = (userInfo) => {
	const schema = joi.object({
		emailUsername: joi.string().min(6).max(30).required()
	});
	return schema.validate(userInfo, options);
};

module.exports = {validateUserSignupDetails, validateUserLoginDetails};