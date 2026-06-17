require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const sequelize = require("./config/database");
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
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') console.log("Body:", JSON.stringify(req.body));
    next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes 
app.get("/", (req, res) => res.redirect("/employees"));
app.use("/employees", employeeRoutes);

// Error handling
app.use((req, res) => res.status(404).send("Not Found"));
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (req.xhr || req.path.includes('/api')) {
        return res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    }
    res.status(500).render("error", { message: err.message });
});

// Database Sync and Start
sequelize.sync({ alter: true })
    .then(() => {
        console.log("*****************************************");
        console.log("   QENGINE SERVER CONNECTED & SYNCED    ");
        console.log(`   TIME: ${new Date().toISOString()}    `);
        console.log("*****************************************");
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error("Database connection error:", err));
