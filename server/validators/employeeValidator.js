const Joi = require('joi');
const logger = require('../utils/logger');
const { GENDER, COMMUNICATION, DEPARTMENT, REGEX_PATTERNS } = require('../constants/mappings');

// error callbakc function
function validationErrorHandler(error) {
    logger.error(error);
    return error;
}

const employeeSchema = Joi.object({
    employeeId: Joi.any().optional(), // handled automatically

    firstName: Joi.string().pattern(REGEX_PATTERNS.ALPHAONLY).required().messages({
        'string.pattern.base': 'First Name must start with a letter'
    }).error(validationErrorHandler),

    lastName: Joi.string().pattern(REGEX_PATTERNS.ALPHAONLY).required().messages({
        'string.pattern.base': 'Last Name must start with a letter'
    }).error(validationErrorHandler),

    jobTitle: Joi.string().pattern(REGEX_PATTERNS.ALPHAONLY).required().messages({
        'string.pattern.base': 'Job Title must start with a letter'
    }).error(validationErrorHandler),

    salary: Joi.number().positive().integer().max(9 ** 10 - 1).required().error(validationErrorHandler),

    dob: Joi.date().iso().custom((value, helpers) => {
        const today = new Date();
        const dob = new Date(value);

        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 120);

        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() + 120);

        const ageLimitDate = new Date();
        ageLimitDate.setFullYear(today.getFullYear() - 18);

        if (dob < minDate || dob > maxDate) {
            return helpers.message('Date must be within 120 years from today');
        }
        if (dob > ageLimitDate) {
            return helpers.message('Employee must be at least 18 years old');
        }
        return value;
    }).required().error(validationErrorHandler),

    ssn: Joi.string().pattern(REGEX_PATTERNS.SSN).required().messages({
        'string.pattern.base': 'SSN must follow XXX-XX-XXXX format'
    }).error(validationErrorHandler),

    gender: Joi.number().valid(...Object.values(GENDER)).required(),

    address: Joi.string().min(10).max(80).required(),

    phone: Joi.string().pattern(REGEX_PATTERNS.PHONE).required().error(
        (err) => {
            logger.error(err);
            return err;
        }
    ),
    salary: Joi.number().positive().integer().max(9 ** 10 - 1).required().error(
        (err) => {
            logger.error(err);
            return err;
        }
    ),
    dob: Joi.date().iso().custom((value, helpers) => {
        const today = new Date();
        const dob = new Date(value);

        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 120);

        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() + 120);

        const ageLimitDate = new Date();
        ageLimitDate.setFullYear(today.getFullYear() - 18);

        if (dob < minDate || dob > maxDate) {
            return helpers.message('Date must be within 120 years from today');
        }
        if (dob > ageLimitDate) {
            return helpers.message('Employee must be at least 18 years old');
        }
        return value;
    }).required(),
    ssn: Joi.string().pattern(REGEX_PATTERNS.SSN).required().messages({
        'string.pattern.base': 'SSN must follow XXX-XX-XXXX format'
    }).error(validationErrorHandler),

    gender: Joi.number().valid(...Object.values(GENDER)).required(),

    address: Joi.string().min(10).max(80).required(),

    phone: Joi.string().pattern(REGEX_PATTERNS.PHONE).required().error(validationErrorHandler),

    email: Joi.string().email().required(),

    preferredCommunication: Joi.number().valid(...Object.values(COMMUNICATION)).required(),

    jobTitle: Joi.string().pattern(REGEX_PATTERNS.ALPHAONLY).required().messages({
        'string.pattern.base': 'Job Title must start with a letter'
    }).error(validationErrorHandler),

    department: Joi.number().valid(...Object.values(DEPARTMENT)).required(),

    salary: Joi.integer().positive().max(9 ** 10 - 1).required().error(validationErrorHandler),
});

module.exports = {
    validateEmployee: (data) => employeeSchema.validate(data, { abortEarly: false })
};
