import Joi from "joi";
import CONSTANTS from "./constants/Constants.js";

const calcAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const employeeSchema = Joi.object({
    firstName: Joi.string().trim().min(CONSTANTS.NAME_MIN).max(CONSTANTS.NAME_MAX).pattern(CONSTANTS.REGEX.ALPHA_EXTENDED).required(),
    lastName: Joi.string().trim().min(CONSTANTS.NAME_MIN).max(CONSTANTS.NAME_MAX).pattern(CONSTANTS.REGEX.ALPHA_EXTENDED).required(),
    dateOfBirth: Joi.date().required().custom((value, helpers) => {
        if (new Date(value) >= new Date()) return helpers.message("Date of birth must be in the past");
        if (calcAge(value) < CONSTANTS.MIN_AGE) return helpers.message(`Employee must be at least ${CONSTANTS.MIN_AGE} years old`);
        return value;
    }),
    socialSecurityNumber: Joi.string().trim().pattern(CONSTANTS.REGEX.SSN).required(),
    gender: Joi.number().integer().valid(...Object.keys(CONSTANTS.GENDERS).map(Number)).required(),
    address: Joi.string().trim().min(CONSTANTS.ADDRESS_MIN).max(CONSTANTS.ADDRESS_MAX).required(),
    phoneNumber: Joi.string().pattern(CONSTANTS.REGEX.PHONE).required(),
    emailAddress: Joi.string().pattern(CONSTANTS.REGEX.EMAIL_REGEX).required(),
    preferredCommunication: Joi.number().integer().valid(...Object.keys(CONSTANTS.COMMUNICATIONS).map(Number)).required(),
    jobTitle: Joi.string().trim().min(1).max(CONSTANTS.JOBTITLE_MAX).required(),
    department: Joi.number().integer().valid(...Object.keys(CONSTANTS.DEPARTMENTS).map(Number)).required(),
    salary: Joi.number().positive().precision(2).required(),
});

const payload = {
    firstName: "",
    lastName: "Doe",
    dateOfBirth: "2050-01-01",
    socialSecurityNumber: "123",
    gender: "0",
    address: "short",
    phoneNumber: "555867",
    emailAddress: "john",
    preferredCommunication: "0",
    jobTitle: "",
    department: "0",
    salary: "-100"
};

const { error, value } = employeeSchema.validate(payload, { abortEarly: false });
if (error) {
    console.log("Validation error:", error.details.map(e => e.message));
} else {
    console.log("Validation success!");
}
