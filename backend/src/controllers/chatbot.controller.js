// import { asyncHandler } from "../utils/asyncHandler.js"; 
// import { ApiError } from "../utils/ApiError.js"; 
// import { ApiResponse } from "../utils/ApiResponse.js"; 
// import { GEMINI_API_URL } from "../constants.js"; 
// import axios from "axios"; 
// import fs from "fs";
// import path from "path";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

// const RESTRICTION_MESSAGE = 
//     "💪 I can only assist with fitness, gym, workout, nutrition, health, and wellness-related topics. Please ask about exercises, training routines, diet plans, gym equipment, or health advice!"; 

// // Function to convert image to base64
// const imageToBase64 = (imagePath) => {
//     try {
//         const imageBuffer = fs.readFileSync(imagePath);
//         const base64String = imageBuffer.toString('base64');
//         return base64String;
//     } catch (error) {
//         console.error('Error converting image to base64:', error);
//         return null;
//     }
// };

// // Function to get image mime type
// const getImageMimeType = (imagePath) => {
//     const ext = path.extname(imagePath).toLowerCase();
//     const mimeTypes = {
//         '.jpg': 'image/jpeg',
//         '.jpeg': 'image/jpeg',
//         '.png': 'image/png',
//         '.gif': 'image/gif',
//         '.webp': 'image/webp'
//     };
//     return mimeTypes[ext] || 'image/jpeg';
// };

// const chat = asyncHandler(async (req, res) => { 
//     const { message, history } = req.body; 
//     const imageFile = req.file; // Image file from multer

//     if (!message) { 
//         throw new ApiError(400, "Message is required"); 
//     } 

//     if (!history || !Array.isArray(history)) { 
//         throw new ApiError(400, "History must be an array"); 
//     } 

//     // Format chat history for Gemini API 
//     const formattedHistory = history.map((msg) => ({ 
//         role: msg.role === "assistant" ? "model" : msg.role, 
//         parts: [{ text: msg.content + ' give response with emojis' }], 
//     })); 

//     // Prepare the current message parts
//     let messageParts = [{ text: message }];

//     // If image is provided, add it to the message
//     if (imageFile) {
//         const imagePath = imageFile.path;
//         const base64Image = imageToBase64(imagePath);
//         const mimeType = getImageMimeType(imagePath);

//         if (base64Image) {
//             messageParts.push({
//                 inline_data: {
//                     mime_type: mimeType,
//                     data: base64Image
//                 }
//             });
//         }

//         // Clean up uploaded file after processing
//         try {
//             fs.unlinkSync(imagePath);
//         } catch (error) {
//             console.error('Error deleting uploaded file:', error);
//         }
//     }

//     // Append the new message to history 
//     formattedHistory.push({ 
//         role: "user", 
//         parts: messageParts 
//     }); 

//     try {
//         // Step 1: Get AI response 
//         const response = await axios.post( 
//             `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, 
//             { 
//                 contents: formattedHistory, 
//             } 
//         ); 

//         const aiMessage = 
//             response.data.candidates[0]?.content?.parts[0]?.text || 
//             "Sorry, I couldn't process that."; 

//         // Step 2: Send AI response back to Gemini for verification 
//         const verificationPrompt = `Is the following response related to fitness, gym, workout, nutrition, health, wellness, bodybuilding, weight loss, muscle building, sports, or physical activities? Answer only "yes" or "no". Response: "${aiMessage}"`; 

//         const verificationResponse = await axios.post( 
//             `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, 
//             { 
//                 contents: [{ role: "user", parts: [{ text: verificationPrompt }] }], 
//             } 
//         ); 

//         const verificationAnswer = 
//             verificationResponse.data.candidates[0]?.content?.parts[0]?.text.toLowerCase() || 
//             "no"; 

//         // Step 3: Send final reply based on verification 
//         const finalReply = verificationAnswer.includes("yes") ? aiMessage : RESTRICTION_MESSAGE; 

//         return res.status(200).json(new ApiResponse({ 
//             statusCode: 200, 
//             data: { reply: finalReply }, 
//             message: "Chat response generated successfully" 
//         })); 

//     } catch (error) {
//         console.error('Gemini API Error:', error.response?.data || error.message);
        
//         // Clean up uploaded file in case of error
//         if (imageFile && fs.existsSync(imageFile.path)) {
//             try {
//                 fs.unlinkSync(imageFile.path);
//             } catch (unlinkError) {
//                 console.error('Error deleting uploaded file after API error:', unlinkError);
//             }
//         }
        
//         throw new ApiError(500, "Failed to generate chat response");
//     }
// }); 

// export { chat };










import { asyncHandler } from "../utils/asyncHandler.js"; 
import { ApiError } from "../utils/ApiError.js"; 
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { GEMINI_API_URL } from "../constants.js"; 
import axios from "axios"; 
import fs from "fs";
import path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

const RESTRICTION_MESSAGE = 
    "💪 I can only assist with fitness, gym, workout, nutrition, health, and wellness-related topics. Please ask about exercises, training routines, diet plans, gym equipment, or health advice!"; 

// Function to convert image to base64
const imageToBase64 = (imagePath) => {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64String = imageBuffer.toString('base64');
        return base64String;
    } catch (error) {
        console.error('Error converting image to base64:', error);
        return null;
    }
};

// Function to get image mime type
const getImageMimeType = (imagePath) => {
    const ext = path.extname(imagePath).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
};

const chat = asyncHandler(async (req, res) => { 
    const { message, history: historyString } = req.body; 
    const imageFile = req.file; // Image file from multer

    if (!message) { 
        throw new ApiError(400, "Message is required"); 
    } 

    // Parse history if it's a string (from form-data)
    let history;
    try {
        if (typeof historyString === 'string') {
            history = JSON.parse(historyString);
        } else {
            history = historyString;
        }
    } catch (error) {
        throw new ApiError(400, "Invalid history format. Must be a valid JSON array");
    }

    if (!history || !Array.isArray(history)) { 
        throw new ApiError(400, "History must be an array"); 
    } 

    // Format chat history for Gemini API 
    const formattedHistory = history.map((msg) => ({ 
        role: msg.role === "assistant" ? "model" : msg.role, 
        parts: [{ text: msg.content + ' give response with emojis' }], 
    })); 

    // Prepare the current message parts
    let messageParts = [{ text: message }];

    // If image is provided, add it to the message
    if (imageFile) {
        const imagePath = imageFile.path;
        const base64Image = imageToBase64(imagePath);
        const mimeType = getImageMimeType(imagePath);

        if (base64Image) {
            messageParts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: base64Image
                }
            });
        }

        // Clean up uploaded file after processing
        try {
            fs.unlinkSync(imagePath);
        } catch (error) {
            console.error('Error deleting uploaded file:', error);
        }
    }

    // Append the new message to history 
    formattedHistory.push({ 
        role: "user", 
        parts: messageParts 
    }); 

    try {
        // Step 1: Get AI response 
        const response = await axios.post( 
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, 
            { 
                contents: formattedHistory, 
            } 
        ); 

        const aiMessage = 
            response.data.candidates[0]?.content?.parts[0]?.text || 
            "Sorry, I couldn't process that."; 

        // Step 2: Send AI response back to Gemini for verification 
        const verificationPrompt = `Is the following response related to fitness, gym, workout, nutrition, health, wellness, bodybuilding, weight loss, muscle building, sports, or physical activities? Answer only "yes" or "no". Response: "${aiMessage}"`; 

        const verificationResponse = await axios.post( 
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, 
            { 
                contents: [{ role: "user", parts: [{ text: verificationPrompt }] }], 
            } 
        ); 

        const verificationAnswer = 
            verificationResponse.data.candidates[0]?.content?.parts[0]?.text.toLowerCase() || 
            "no"; 

        // Step 3: Send final reply based on verification 
        const finalReply = verificationAnswer.includes("yes") ? aiMessage : RESTRICTION_MESSAGE; 

        return res.status(200).json(new ApiResponse({ 
            statusCode: 200, 
            data: { reply: finalReply }, 
            message: "Chat response generated successfully" 
        })); 

    } catch (error) {
        console.error('Gemini API Error:', error.response?.data || error.message);
        
        // Clean up uploaded file in case of error
        if (imageFile && fs.existsSync(imageFile.path)) {
            try {
                fs.unlinkSync(imageFile.path);
            } catch (unlinkError) {
                console.error('Error deleting uploaded file after API error:', unlinkError);
            }
        }
        
        throw new ApiError(500, "Failed to generate chat response");
    }
}); 

export { chat };