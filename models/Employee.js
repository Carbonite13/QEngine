import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../config/db.js";
import CONSTANTS from "../constants/Constants.js";

class Employee extends Model { }

Employee.init(
    {
        employeeId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(CONSTANTS.NAME_MAX),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [CONSTANTS.NAME_MIN, CONSTANTS.NAME_MAX],
                is: CONSTANTS.REGEX.NAME,
            },
        },
        lastName: {
            type: DataTypes.STRING(CONSTANTS.NAME_MAX),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [CONSTANTS.NAME_MIN, CONSTANTS.NAME_MAX],
                is: CONSTANTS.REGEX.NAME,
            },
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true,
                isPast(value) {
                    if (new Date(value) >= new Date()) throw new Error("Date of birth must be in the past");
                },
                minAge(value) {
                    const dob = new Date(value);
                    const today = new Date();
                    let age = today.getFullYear() - dob.getFullYear();
                    const monthDiff = today.getMonth() - dob.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
                    if (age < CONSTANTS.MIN_AGE) throw new Error(`Employee must be at least ${CONSTANTS.MIN_AGE} years old`);
                },
            },
        },
        socialSecurityNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [4, 20],
                is: CONSTANTS.REGEX.SSN,
            },
        },
        // will be mapped in the application
        gender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(CONSTANTS.ADDRESS_MAX),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [CONSTANTS.ADDRESS_MIN, CONSTANTS.ADDRESS_MAX],
            },
        },
        phoneNumber: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [10, 10],
                is: CONSTANTS.REGEX.PHONE,
            },
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true,
            },
        },
        // will be mapped in the pplication
        preferredCommunication: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        jobTitle: {
            type: DataTypes.STRING(CONSTANTS.JOBTITLE_MAX),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, CONSTANTS.JOBTITLE_MAX],
            },
        },
        // will be mapped in the pplication
        department: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        salary: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                notEmpty: true,
                isDecimal: true,
            },
        },
    },
    {
        sequelize,
        modelName: "Employee",
        tableName: "employees",
        timestamps: true,
    }
);

export default Employee;