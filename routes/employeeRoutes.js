const express = require("express");
const router = express.Router();
const c = require("../controllers/employeeController");

router.get("/", c.getAllEmployees);
router.get("/:id", c.getEmployeeById);
router.post("/", c.createEmployee);
router.put("/:id", c.updateEmployee);
router.delete("/:id", c.deleteEmployee);

module.exports = router;