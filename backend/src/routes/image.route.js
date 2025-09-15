import { Router } from "express";
import {
    saveImage,
    getSavedImages,
    deleteImage
} from "../controllers/image.controller.js";

const router = Router();

// Route to save captured image
router.route("/save").post(saveImage);

// Route to get all saved images
router.route("/gallery").get(getSavedImages);

// Route to delete an image
router.route("/delete/:fileName").delete(deleteImage);

export default router;