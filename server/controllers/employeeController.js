const Employee = require("../models/Employee");

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch employees", details: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const data = req.body;
        
        // Generate employeeId if not provided (e.g., EIMS-1718293041)
        if (!data.employeeId || data.employeeId.trim() === "") {
            data.employeeId = `EIMS-${Date.now()}`;
        }

        const employee = await Employee.create(data);
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ error: "Failed to create employee", details: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Employee.update(
            req.body,
            {
                where: {
                    employeeId: id
                }
            }
        );

        if (updated) {
            const updatedEmployee = await Employee.findOne({ where: { employeeId: id } });
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ error: "Employee not found" });
        }
    } catch (error) {
        res.status(400).json({ error: "Failed to update employee", details: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Employee.destroy({
            where: {
                employeeId: id
            }
        });

        if (deleted) {
            res.json({ message: "Employee deleted successfully" });
        } else {
            res.status(404).json({ error: "Employee not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete employee", details: error.message });
    }
};