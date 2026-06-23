const { ValidationError } = require("@sequelize/core");

module.exports = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(400).json({
            success: false,
            message: "Database validation failed",
            errors: err.errors.map((e) => e.message)
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
};