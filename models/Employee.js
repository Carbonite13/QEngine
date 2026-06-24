import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../config/db.js";
import {
    NAME_MIN,
    NAME_MAX,
    ADDRESS_MIN,
    ADDRESS_MAX,
    JOBTITLE_MAX,
    REGEX,
    MIN_AGE,
} from "../constants/validationConstants.js";

class Employee extends Model { }

Employee.init(
    {
        employeeId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(NAME_MAX),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [NAME_MIN, NAME_MAX],
                is: REGEX.NAME,
            },
        },
        lastName: {
            type: DataTypes.STRING(NAME_MAX),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [NAME_MIN, NAME_MAX],
                is: REGEX.NAME,
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
                    if (age < MIN_AGE) throw new Error(`Employee must be at least ${MIN_AGE} years old`);
                },
            },
        },
        socialSecurityNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [4, 20],
                is: REGEX.SSN,
            },
        },
        // will be mapped in the application
        gender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(ADDRESS_MAX),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [ADDRESS_MIN, ADDRESS_MAX],
            },
        },
        phoneNumber: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [10, 10],
                is: REGEX.PHONE,
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
            type: DataTypes.STRING(JOBTITLE_MAX),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, JOBTITLE_MAX],
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
                is: REGEX.SALARY,
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