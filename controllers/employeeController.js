import employeeService from "../services/employeeService.js";
import Joi from "joi";
import {
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
} from "../constants/validationConstants.js";
import C from "../constants/validationConstants.js";

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
    gender: Joi.number().integer().min(0).max(GENDERS.length - 1).required(),
    address: Joi.string().trim().min(ADDRESS_MIN).max(ADDRESS_MAX).required(),
    phoneNumber: Joi.string().pattern(REGEX.PHONE).required(),
    emailAddress: Joi.string().pattern(REGEX.EMAIL).required(),
    preferredCommunication: Joi.number().integer().min(0).max(COMMUNICATIONS.length - 1).required(),
    jobTitle: Joi.string().trim().min(1).max(JOBTITLE_MAX).required(),
    department: Joi.number().integer().min(0).max(DEPARTMENTS.length - 1).required(),
    salary: Joi.number().positive().precision(2).required(),
});

function renderPage(req, res) {
    res.render("employees", { C });
};

function mapEmployee(e) {
    const json = e.toJSON ? e.toJSON() : e;
    return {
        ...json,
        genderName: C.GENDERS[json.gender] || "Unknown",
        departmentName: C.DEPARTMENTS[json.department] || "Unknown",
        preferredCommunicationName: C.COMMUNICATIONS[json.preferredCommunication] || "Unknown"
    };
};

async function getAll(req, res, next) {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json({ success: true, data: employees.map(mapEmployee) });
    } catch (error) {
        next(error);
    }
};

async function get(req, res, next) {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        res.json({ success: true, data: mapEmployee(employee) });
    } catch (error) {
        next(error);
    }
};

async function create(req, res, next) {
    try {
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

        const employee = await employeeService.createEmployee(value);

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: mapEmployee(employee),
        });
    } catch (error) {
        next(error);
    }
};

async function update(req, res, next) {
    try {
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

        const employee = await employeeService.updateEmployee(req.params.id, value);

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
    } catch (error) {
        next(error);
    }
};

async function remove(req, res, next) {
    try {
        const deleted = await employeeService.deleteEmployee(req.params.id);

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
    } catch (error) {
        next(error);
    }
};

export {
    renderPage,
    getAll,
    get,
    create,
    update,
    remove,
};