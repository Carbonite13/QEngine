import employeeService from "../services/EmployeeService.js";
import Joi from "joi";
import CONSTANTS from "../constants/Constants.js";

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
    emailAddress: Joi.string().pattern(CONSTANTS.REGEX.EMAIL).required(),
    preferredCommunication: Joi.number().integer().valid(...Object.keys(CONSTANTS.COMMUNICATIONS).map(Number)).required(),
    jobTitle: Joi.string().trim().min(1).max(CONSTANTS.JOBTITLE_MAX).required(),
    department: Joi.number().integer().valid(...Object.keys(CONSTANTS.DEPARTMENTS).map(Number)).required(),
    salary: Joi.number().positive().precision(2).required(),
});

function renderPage(req, res) {
    res.render("employees", { CONSTANTS });
};

function mapEmployee(e) {
    const json = e.toJSON ? e.toJSON() : e;
    return {
        ...json,
        genderName: CONSTANTS.GENDERS[json.gender] || "Unknown",
        departmentName: CONSTANTS.DEPARTMENTS[json.department] || "Unknown",
        preferredCommunicationName: CONSTANTS.COMMUNICATIONS[json.preferredCommunication] || "Unknown"
    };
};

function getAll(req, res, next) {
    employeeService.getAll()
        .then((employees) => res.json({ success: true, data: employees.map(mapEmployee) }))
        .catch(next);
};

function get(req, res, next) {
    employeeService.get(req.params.id)
        .then((employee) => {
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: "Employee not found",
                });
            }
            res.json({ success: true, data: mapEmployee(employee) });
        })
        .catch(next);
};

function create(req, res, next) {
    const { error, value } = employeeSchema.validate(req.body, {
        abortEarly: false,
        convert: true,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map((e) => e.message),
        });
    }

    employeeService.create(value)
        .then((employee) => {
            res.status(201).json({
                success: true,
                message: "Employee created successfully",
                data: mapEmployee(employee),
            });
        })
        .catch(next);
};

function update(req, res, next) {
    const { error, value } = employeeSchema.validate(req.body, {
        abortEarly: false,
        convert: true,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map((e) => e.message),
        });
    }

    employeeService.update(req.params.id, value)
        .then((employee) => {
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: "Employee not found",
                });
            }
            res.json({
                success: true,
                message: "Employee updated successfully",
                data: mapEmployee(employee),
            });
        })
        .catch(next);
};

function remove(req, res, next) {
    employeeService.delete(req.params.id)
        .then((deleted) => {
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Employee not found",
                });
            }
            res.json({
                success: true,
                message: "Employee deleted successfully",
            });
        })
        .catch(next);
};

export {
    renderPage,
    getAll,
    get,
    create,
    update,
    remove,
};