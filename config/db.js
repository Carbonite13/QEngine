import { Sequelize } from "@sequelize/core";
import { MySqlDialect } from "@sequelize/mysql";

import dotenv from "dotenv";

dotenv.config({ path: '.env.local', override: true });

const sequelize = new Sequelize({
    dialect: MySqlDialect,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    logging: false,
});

export default sequelize;
