const employeeService = require('../services/employeeService');
const { validateEmployee } = require('../validators/employeeValidator');
const logger = require('../utils/logger');
const { GENDER, COMMUNICATION, DEPARTMENT, GENDER_LABELS, COMMUNICATION_LABELS, DEPARTMENT_LABELS } = require('../constants/mappings');

// Render main page
exports.index = async (req, res) => {
    try {
        res.render('employees/index', {
            title: 'Employee Management System',
            mappings: {
                GENDER,
                COMMUNICATION,
                DEPARTMENT,
                GENDER_LABELS,
                COMMUNICATION_LABELS,
                DEPARTMENT_LABELS
            }
        });
    } catch (error) {
        logger.error('Error rendering index page:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
};

// Get all employees (JSON)
exports.getEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};

// Get single employee (JSON)
exports.getEmployee = async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
};

// Create employee
exports.createEmployee = async (req, res) => {
    const { error } = validateEmployee(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    }

    try {
        const employee = await employeeService.createEmployee(req.body);
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create employee' });
    }
};

// Update employee
exports.updateEmployee = async (req, res) => {
    const { error } = validateEmployee(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    }

    try {
        const employee = await employeeService.updateEmployee(req.params.id, req.body);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
    }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const success = await employeeService.deleteEmployee(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
};
