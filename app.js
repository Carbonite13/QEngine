import express from "express";
import path from "path";
import morgan from "morgan";
import sequelize from "./config/db.js";
import employeeRoutes from "./routes/EmployeeRoutes.js";
import errorHandler from "./middleware/ErrorHandler.js";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

import * as employeeController from "./controllers/EmployeeController.js";

app.get("/", employeeController.renderPage);

app.use("/employees", employeeRoutes);

app.use((req, res, next) => {
    const err = new Error("Route not found");
    err.status = 404;
    next(err);
});

app.use(errorHandler);

sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
    // if (module.parent === null) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    // }
});

export default app;
