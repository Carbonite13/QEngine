const Joi = require("joi");
const {
    NAME_MIN,
    NAME_MAX,
    ADDRESS_MIN,
    ADDRESS_MAX,
    JOBTITLE_MAX,
    GENDERS,
    COMMUNICATIONS,
    DEPARTMENTS,
    REGEX,
    MIN_AGE,
} = require("../constants/validationConstants");

const calcAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const employeeSchema = Joi.object({
    firstName: Joi.string().trim().min(NAME_MIN).max(NAME_MAX).pattern(REGEX.NAME).required(),
    lastName: Joi.string().trim().min(NAME_MIN).max(NAME_MAX).pattern(REGEX.NAME).required(),
    dateOfBirth: Joi.date().required().custom((value, helpers) => {
        if (new Date(value) >= new Date()) return helpers.message("Date of birth must be in the past");
        if (calcAge(value) < MIN_AGE) return helpers.message(`Employee must be at least ${MIN_AGE} years old`);
        return value;
    }),
    socialSecurityNumber: Joi.string().trim().pattern(REGEX.SSN).required(),
    gender: Joi.string().valid(...GENDERS).required(),
    address: Joi.string().trim().min(ADDRESS_MIN).max(ADDRESS_MAX).required(),
    phoneNumber: Joi.string().pattern(REGEX.PHONE).required(),
    emailAddress: Joi.string().pattern(REGEX.EMAIL).required(),
    preferredCommunication: Joi.string().valid(...COMMUNICATIONS).required(),
    jobTitle: Joi.string().trim().min(1).max(JOBTITLE_MAX).required(),
    department: Joi.string().valid(...DEPARTMENTS).required(),
    salary: Joi.number().positive().precision(2).required(),
});

module.exports = employeeSchema;