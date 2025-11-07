
// routes/chatbot.routes.js
import { Router } from "express";
import { chat } from "../controllers/chatbot.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Route with multiple image upload support (max 5 images)
// The 'images' field name should match what you use in your frontend form
router.route("/chat").post(
    // verifyJWT, // Uncomment if authentication is required
    // Allow up to 5 images with field name 'images'
    chat
);

export default router;