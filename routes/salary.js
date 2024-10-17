import express from "express";
import authMiddleWare from "../middleware/authMiddleWare.js";
import { addSalary, getSalary } from "../controllers/salaryController.js";

const router = express.Router();


router.post("/add", authMiddleWare, addSalary);
router.get("/:id/:role", authMiddleWare, getSalary);

export default router;
