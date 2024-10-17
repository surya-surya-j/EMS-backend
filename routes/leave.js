import express from "express";
import authMiddleWare from "../middleware/authMiddleWare.js";
import {
  addLeave,
  getLeave,
  getLeaves,
  getLeaveDetail,
  updateLeave,
} from "../controllers/leaveController.js";

const router = express.Router();

router.post("/add", authMiddleWare, addLeave);

router.get("/detail/:id", authMiddleWare, getLeaveDetail);
router.get("/:id/:role", authMiddleWare, getLeave);
router.get("/", authMiddleWare, getLeaves);
router.put("/detail/:id", authMiddleWare, updateLeave);

export default router;
