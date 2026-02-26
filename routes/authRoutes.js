import express from "express"
import { getCurrentUser, Login, logout, refreshToken, Register } from "../Controllers/userController.js";
import { protect } from "../middleware/authmiddleware.js";


const router = express.Router();


router.post("/register",Register);
router.post("/login",Login);
router.post("/refresh",refreshToken);
router.post("/logout",protect,logout)
router.get("/me",protect,getCurrentUser)
export default router;