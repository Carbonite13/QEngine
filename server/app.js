require("dotenv").config();

// imports
const express = require("express");
const path = require("path");
const cors = require("cors");
const sequelize = require("./config/database");
const logger = require("./utils/logger");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "*"
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    if (req.method === 'POST') logger.debug("Body: %o", req.body);
    next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes 
app.use("/", employeeRoutes);

// Error handling
app.use((req, res) => res.status(404).send("Not Found"));
app.use((err, req, res, next) => {
    logger.error(err.stack);
    if (req.xhr || req.path.includes('/api')) {
        return res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    }
    res.status(500).render("error", { message: err.message });
});

// Database Sync and Start
sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => logger.info(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => logger.error("Database connection error: %o", err));
