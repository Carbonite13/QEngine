const { DataTypes, Model } = require("@sequelize/core");
const sequelize = require("../config/db");
const {
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
} = require("../constants/validationConstants");

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
        gender: {
            type: DataTypes.ENUM(...GENDERS),
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
        preferredCommunication: {
            type: DataTypes.ENUM(...COMMUNICATIONS),
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
        department: {
            type: DataTypes.ENUM(...DEPARTMENTS),
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

module.exports = Employee;