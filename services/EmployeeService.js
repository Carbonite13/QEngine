import Employee from "../models/Employee.js";

class EmployeeService {
    async getAll() {
        return await Employee.findAll({
            order: [["employeeId", "DESC"]],
        });
    }

    async get(id) {
        return await Employee.findByPk(id);
    }

    async create(data) {
        return await Employee.create(data);
    }

    async update(id, data) {
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return null;
        }
        return await employee.update(data);
    }

    async delete(id) {
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return false;
        }
        await employee.destroy();
        return true;
    }
}

export default new EmployeeService();
