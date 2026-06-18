const Employee = require('../models/Employee');
const logger = require('../utils/logger');
const { GENDER_LABELS, COMMUNICATION_LABELS, DEPARTMENT_LABELS } = require('../constants/mappings');

class EmployeeService {
    async getAllEmployees() {
        try {
            const employees = await Employee.findAll({ order: [['employeeId', 'DESC']] });
            return employees;
        } catch (error) {
            logger.error('Error in EmployeeService.getAllEmployees:', error);
            throw error;
        }
    }

    async getEmployeeById(id) {
        try {
            const employee = await Employee.findByPk(id);
            return employee;
        } catch (error) {
            logger.error(`Error in EmployeeService.getEmployeeById for ID ${id}:`, error);
            throw error;
        }
    }

    async createEmployee(employeeData) {
        try {
            if (!employeeData.employeeId || employeeData.employeeId === '') {
                delete employeeData.employeeId;
            }
            const employee = await Employee.create(employeeData);
            logger.info(`Employee created with ID: ${employee.employeeId}`);
            return employee;
        } catch (error) {
            logger.error('Error in EmployeeService.createEmployee:', error);
            throw error;
        }
    }

    async updateEmployee(id, employeeData) {
        try {
            const employee = await Employee.findByPk(id);
            if (!employee) {
                return null;
            }
            const updatedEmployee = await employee.update(employeeData);
            logger.info(`Employee updated with ID: ${id}`);
            return updatedEmployee;
        } catch (error) {
            logger.error(`Error in EmployeeService.updateEmployee for ID ${id}:`, error);
            throw error;
        }
    }

    async deleteEmployee(id) {
        try {
            const deletedCount = await Employee.destroy({ where: { employeeId: id } });
            if (deletedCount > 0) {
                logger.info(`Employee deleted with ID: ${id}`);
            }
            return deletedCount > 0;
        } catch (error) {
            logger.error(`Error in EmployeeService.deleteEmployee for ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Optional: Method to map integer values to labels for UI display if needed on backend
     */
    formatEmployee(employee) {
        const raw = employee.get({ plain: true });
        return {
            ...raw,
            genderLabel: GENDER_LABELS[raw.gender],
            preferredCommunicationLabel: COMMUNICATION_LABELS[raw.preferredCommunication],
            departmentLabel: DEPARTMENT_LABELS[raw.department]
        };
    }
}

module.exports = new EmployeeService();
