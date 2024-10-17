import express from "express";
import { login, verify } from "../controllers/authContoller.js";
import authMiddleWare from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/login", login);
router.get("/verify", authMiddleWare, verify);

export default router;
