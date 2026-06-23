const Employee = require("../models/Employee");
const employeeSchema = require("../validations/employeeValidation");

const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.findAll({
            order: [["employeeId", "DESC"]],
        });
        res.json({ success: true, data: employees });
    } catch (error) {
        next(error);
    }
};

const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        res.json({ success: true, data: employee });
    } catch (error) {
        next(error);
    }
};

const createEmployee = async (req, res, next) => {
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

        const employee = await Employee.create(value);

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

const updateEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

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

        await employee.update(value);

        res.json({
            success: true,
            message: "Employee updated successfully",
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        await employee.destroy();

        res.json({
            success: true,
            message: "Employee deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};