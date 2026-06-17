const Employee = require("../models/Employee");
const { validateEmployee } = require("../validators/employeeValidator");

// Render main page
exports.index = async (req, res) => {
    res.render("employees/index", { title: "Employee Management System" });
};

// Get all employees (JSON)
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({ order: [["employeeId", "DESC"]] });
        console.log(`Fetched ${employees.length} employees`);
        res.json(employees);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get single employee (JSON)
exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ error: "Employee not found" });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create employee
exports.createEmployee = async (req, res) => {
    console.log(">>> CREATE REQUEST RECEIVED <<<");
    console.log("Data:", JSON.stringify(req.body));
    
    const { error } = validateEmployee(req.body);
    if (error) {
        console.log("Validation Failed:", error.details[0].message);
        return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    }

    try {
        const data = { ...req.body };
        if (!data.employeeId || data.employeeId === "") delete data.employeeId;

        console.log("Attempting DB Insert...");
        const employee = await Employee.create(data);
        console.log("Success! New ID:", employee.employeeId);
        res.status(201).json(employee);
    } catch (err) {
        console.error("DATABASE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

// Update employee
exports.updateEmployee = async (req, res) => {
    console.log("Updating employee:", req.params.id);
    const { error } = validateEmployee(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });

    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ error: "Employee not found" });
        
        await employee.update(req.body);
        console.log("Employee updated successfully");
        res.json(employee);
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const deleted = await Employee.destroy({ where: { employeeId: req.params.id } });
        if (!deleted) return res.status(404).json({ error: "Employee not found" });
        console.log("Employee deleted:", req.params.id);
        res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: err.message });
    }
};
