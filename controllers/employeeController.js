const employeeService = require("../services/employeeService");
const employeeSchema = require("../validations/employeeValidation");

const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json({ success: true, data: employees });
    } catch (error) {
        next(error);
    }
};

const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);

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

        const employee = await employeeService.createEmployee(value);

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
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (req, res, next) => {
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

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};