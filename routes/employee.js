import express from "express";
import authMiddleWare from "../middleware/authMiddleWare.js";
import {
  addEmployee,
  getEmployees,
  upload,
  getEmployee,
  editEmployee,
  fetchEmployeesByDepId,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", authMiddleWare, getEmployees);
router.post("/add", authMiddleWare, upload.single("image"), addEmployee);
router.get("/:id", authMiddleWare, getEmployee);
router.put("/:id", authMiddleWare, editEmployee);
router.get("/department/:id", authMiddleWare, fetchEmployeesByDepId);
export default router;
