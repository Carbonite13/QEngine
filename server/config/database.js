require("dotenv").config();
const { Sequelize } = require("sequelize");
const logger = require("../utils/logger");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432, // Port added as per sequlize v7
        dialect: process.env.DB_DIALECT,
        logging: (msg) => logger.debug(msg),
    },
);

module.exports = sequelize;