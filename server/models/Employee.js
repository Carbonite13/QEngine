const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Employee = sequelize.define("Employee", {

    employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    name: DataTypes.STRING,

    dob: DataTypes.DATEONLY,

    ssn: DataTypes.STRING,

    gender: DataTypes.STRING,

    address: DataTypes.TEXT,

    phone: DataTypes.STRING,

    email: DataTypes.STRING,

    preferredCommunication: DataTypes.STRING,

    jobTitle: DataTypes.STRING,

    department: DataTypes.STRING,

    salary: DataTypes.DECIMAL(10,2)

});

module.exports = Employee;