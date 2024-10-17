import express from "express";
import authMiddleWare from "../middleware/authMiddleWare.js";
import { changePassword } from "../controllers/settingController.js";

const router = express.Router();

router.put("/change-password", authMiddleWare, changePassword);

export default router;
