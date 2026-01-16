import express from "express";
import { register, login, getAllUsers } from "../controllers/auth.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/allusers", authMiddleware, adminMiddleware, getAllUsers);

export default router;
