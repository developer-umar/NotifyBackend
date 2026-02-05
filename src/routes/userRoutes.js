import express from "express";
import { upload } from "../middleware/uploadMidlleware.js";
import { getCurrentUser, uploadProfileImage } from "../controllers/UserControllers.js";
import { loginUser, registerUser } from "../controllers/AuthControllers.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser)
// profile image upload / update


router.put("/upload-profile-image", protect, upload.single("image"), uploadProfileImage);
router.get("/me", protect, getCurrentUser);



export default router;
