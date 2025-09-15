import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller to save captured images to public/images folder
const saveImage = asyncHandler(async (req, res) => {
    try {
        console.log("Received image save request");
        console.log("Request body keys:", Object.keys(req.body));

        const { imageData, fileName } = req.body;

        if (!imageData) {
            console.error("No image data provided");
            throw new ApiError(400, "Image data is required");
        }

        console.log("Image data type:", typeof imageData);
        console.log("Image data length:", imageData.length);
        console.log("Filename:", fileName);

        // Remove data:image/jpeg;base64, prefix if present
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        console.log("Base64 data length after cleanup:", base64Data.length);

        // Generate unique filename if not provided
        const finalFileName = fileName || `fitness-photo-${Date.now()}.jpg`;

        // Create images directory if it doesn't exist
        const imagesDir = path.join(__dirname, '../../public/images');
        console.log("Images directory path:", imagesDir);

        if (!fs.existsSync(imagesDir)) {
            console.log("Creating images directory...");
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        // Full path for the image
        const imagePath = path.join(imagesDir, finalFileName);
        console.log("Full image path:", imagePath);

        // Save the image
        fs.writeFileSync(imagePath, base64Data, 'base64');
        console.log("Image saved successfully to filesystem");

        // Return the public URL path
        const imageUrl = `/images/${finalFileName}`;

        return res.status(200).json(
            new ApiResponse({
                statusCode: 200,
                data: {
                    imageUrl,
                    fileName: finalFileName,
                    message: "Image saved successfully"
                },
                message: "Image uploaded successfully"
            })
        );

    } catch (error) {
        console.error("Error saving image:", error);
        console.error("Error stack:", error.stack);
        throw new ApiError(500, `Failed to save image: ${error.message}`);
    }
});

// Controller to get all saved images
const getSavedImages = asyncHandler(async (req, res) => {
    try {
        const imagesDir = path.join(__dirname, '../../public/images');

        if (!fs.existsSync(imagesDir)) {
            return res.status(200).json(
                new ApiResponse({
                    statusCode: 200,
                    data: [],
                    message: "No images found"
                })
            );
        }

        const files = fs.readdirSync(imagesDir);
        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        const images = imageFiles.map(file => ({
            fileName: file,
            imageUrl: `/images/${file}`,
            createdAt: fs.statSync(path.join(imagesDir, file)).mtime
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

        return res.status(200).json(
            new ApiResponse({
                statusCode: 200,
                data: images,
                message: "Images retrieved successfully"
            })
        );

    } catch (error) {
        console.error("Error getting images:", error);
        throw new ApiError(500, "Failed to retrieve images");
    }
});

// Controller to delete a saved image
const deleteImage = asyncHandler(async (req, res) => {
    try {
        const { fileName } = req.params;

        if (!fileName) {
            throw new ApiError(400, "File name is required");
        }

        const imagePath = path.join(__dirname, '../../public/images', fileName);

        if (!fs.existsSync(imagePath)) {
            throw new ApiError(404, "Image not found");
        }

        fs.unlinkSync(imagePath);

        return res.status(200).json(
            new ApiResponse({
                statusCode: 200,
                data: {},
                message: "Image deleted successfully"
            })
        );

    } catch (error) {
        console.error("Error deleting image:", error);
        throw new ApiError(500, "Failed to delete image");
    }
});

export {
    saveImage,
    getSavedImages,
    deleteImage
};