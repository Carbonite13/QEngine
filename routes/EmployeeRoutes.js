import express from "express";
import * as c from "../controllers/EmployeeController.js";
const router = express.Router();

router.get("/", c.renderPage);

router.get("/employees", c.getAll);
router.get("/employees/:id", c.get);
router.post("/employees", c.create);
router.put("/employees/:id", c.update);
router.delete("/employees/:id", c.remove);

export default router;