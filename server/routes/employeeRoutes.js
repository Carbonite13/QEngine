const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeController");

router.get("/", controller.index);
router.get("/api/all", controller.getEmployees);
router.get("/api/:id", controller.getEmployee);
router.post("/api/create", controller.createEmployee);
router.post("/api/edit/:id", controller.updateEmployee);
router.post("/api/delete/:id", controller.deleteEmployee);

module.exports = router;
