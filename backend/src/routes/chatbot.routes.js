import { Router } from "express"; 
import { chat } from "../controllers/chatbot.controller.js"; 
import { verifyJWT } from "../middlewares/auth.middleware.js"; 
import { upload } from "../middlewares/multer.middleware.js";

const router = Router(); 

// Route with optional image upload
// The 'image' field name should match what you use in your frontend form
router.route("/chat").post(
    // verifyJWT, // Uncomment if authentication is required
    upload.single('image'), // Optional image upload middleware
    chat
);

export default router;