const express = require("express");
const path = require("path");
const morgan = require("morgan");
const sequelize = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("employees");
});

app.use("/employees", employeeRoutes);

app.use((req, res, next) => {
    const err = new Error("Route not found");
    err.status = 404;
    next(err);
});

app.use(errorHandler);

sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
    if (require.main === module) {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
});

module.exports = app;