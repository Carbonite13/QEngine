// config/db.js
const { Sequelize } = require("@sequelize/core");
const { MySqlDialect } = require("@sequelize/mysql");

const sequelize = new Sequelize({
    dialect: MySqlDialect,
    database: "eims_db",
    user: "eims_admin",
    password: "pass",
    host: "localhost",
    port: 3306,
    logging: false,
});

module.exports = sequelize;
