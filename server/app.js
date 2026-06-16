require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const sequelize = require("./config/database");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/api/employees", employeeRoutes);

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (req.path.startsWith("/api/")) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
    res.status(500).send("Something went wrong!");
});

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });