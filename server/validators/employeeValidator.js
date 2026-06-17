const Joi = require('joi');

const employeeSchema = Joi.object({
    employeeId: Joi.any().optional(), 
    firstName: Joi.string().min(1).max(40).required(),
    lastName: Joi.string().min(1).max(40).required(),
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
    ssn: Joi.string().pattern(/^\d{3}-\d{2}-\d{4}$/).required().messages({
        'string.pattern.base': 'SSN must follow XXX-XX-XXXX format'
    }),
    gender: Joi.string().required(),
    address: Joi.string().min(10).max(80).required(),
    phone: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10 digits'
    }),
    email: Joi.string().email().required(),
    preferredCommunication: Joi.string().valid('Email', 'Phone').required(),
    jobTitle: Joi.string().required(),
    department: Joi.string().valid(
        'Sales',
        'Marketing',
        'Human Resources',
        'Finance',
        'Engineering',
        'Information Technology (IT)',
        'Customer Support',
        'Design'
    ).required(),
    salary: Joi.number().positive().required()
});

module.exports = {
    validateEmployee: (data) => employeeSchema.validate(data, { abortEarly: false })
};
