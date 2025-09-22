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










// Done


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
//     const { message, history: historyString } = req.body; 
//     const imageFile = req.file; // Image file from multer

//     if (!message) { 
//         throw new ApiError(400, "Message is required"); 
//     } 

//     // Parse history if it's a string (from form-data)
//     let history;
//     try {
//         if (typeof historyString === 'string') {
//             history = JSON.parse(historyString);
//         } else {
//             history = historyString;
//         }
//     } catch (error) {
//         throw new ApiError(400, "Invalid history format. Must be a valid JSON array");
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

// // Enhanced JSON prompts for better accuracy and security
// const VALIDATION_PROMPT = `
// Analyze the provided message and image (if any) and determine if it's related to fitness, gym, workout, nutrition, health, wellness, bodybuilding, weight loss, muscle building, sports, physical activities, or food nutrition analysis.

// Respond ONLY with a valid JSON object in this exact format:
// {
//   "is_fitness_related": boolean,
//   "confidence_score": number (0-100),
//   "detected_topics": ["topic1", "topic2"],
//   "reason": "brief explanation"
// }

// Be strict in your validation. Only approve content that is clearly related to the specified fitness and health topics.
// `;

// const NUTRITION_ANALYSIS_PROMPT = `
// You are a professional nutritionist and fitness expert. Analyze the provided food image and/or text query.

// Respond ONLY with a valid JSON object in this exact format:
// {
//   "food_identified": boolean,
//   "food_name": "name of the food item",
//   "nutrition_per_100g": {
//     "calories": number,
//     "protein": number,
//     "carbohydrates": number,
//     "fat": number,
//     "fiber": number,
//     "sugar": number,
//     "sodium": number
//   },
//   "health_benefits": ["benefit1", "benefit2"],
//   "fitness_advice": "advice for fitness enthusiasts",
//   "portion_recommendations": {
//     "pre_workout": "recommendation",
//     "post_workout": "recommendation",
//     "general": "recommendation"
//   },
//   "allergens": ["allergen1", "allergen2"],
//   "confidence_level": number (0-100)
// }

// If you cannot identify the food clearly, set food_identified to false and provide general nutrition advice.
// Add relevant emojis to make the response engaging but keep the JSON structure valid.
// `;

// const FITNESS_CHAT_PROMPT = `
// You are an expert fitness trainer, nutritionist, and wellness coach. Provide helpful, accurate, and motivational advice.

// Respond ONLY with a valid JSON object in this exact format:
// {
//   "response_type": "fitness_advice" | "workout_plan" | "nutrition_guidance" | "equipment_info" | "motivation",
//   "main_response": "your detailed response with emojis",
//   "quick_tips": ["tip1", "tip2", "tip3"],
//   "related_topics": ["topic1", "topic2"],
//   "difficulty_level": "beginner" | "intermediate" | "advanced" | "all_levels",
//   "estimated_time": "time if applicable",
//   "equipment_needed": ["equipment1", "equipment2"] or "none"
// }

// Make your response engaging with appropriate emojis while maintaining professionalism.
// `;

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

// // Function to make Gemini API call
// const callGeminiAPI = async (prompt, imageParts = []) => {
//     const messageParts = [{ text: prompt }, ...imageParts];
    
//     const response = await axios.post(
//         `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//         {
//             contents: [{
//                 role: "user",
//                 parts: messageParts
//             }]
//         }
//     );
    
//     return response.data.candidates[0]?.content?.parts[0]?.text || null;
// };

// // Function to parse JSON response safely
// const parseJSONResponse = (jsonString) => {
//     try {
//         // Clean up the response by removing markdown code blocks if present
//         const cleanedJson = jsonString.replace(/```json\s*|\s*```/g, '').trim();
//         return JSON.parse(cleanedJson);
//     } catch (error) {
//         console.error('JSON parsing error:', error);
//         return null;
//     }
// };

// // Function to detect if request is food-related
// const isFoodAnalysisRequest = (message, hasImage) => {
//     const foodKeywords = [
//         'nutrition', 'calories', 'food', 'eat', 'meal', 'diet',
//         'macros', 'protein', 'carbs', 'fat', 'analyze', 'scan'
//     ];
    
//     const messageContainsFoodKeywords = foodKeywords.some(keyword => 
//         message.toLowerCase().includes(keyword)
//     );
    
//     return messageContainsFoodKeywords || hasImage;
// };

// const chat = asyncHandler(async (req, res) => { 
//     const { message, history: historyString } = req.body; 
//     const imageFile = req.file;

//     if (!message) { 
//         throw new ApiError(400, "Message is required"); 
//     } 

//     // Parse history if it's a string (from form-data)
//     let history;
//     try {
//         if (typeof historyString === 'string') {
//             history = JSON.parse(historyString);
//         } else {
//             history = historyString || [];
//         }
//     } catch (error) {
//         throw new ApiError(400, "Invalid history format. Must be a valid JSON array");
//     }

//     if (!Array.isArray(history)) { 
//         throw new ApiError(400, "History must be an array"); 
//     } 

//     let imageParts = [];
//     let imagePath = null;

//     // Process image if provided
//     if (imageFile) {
//         imagePath = imageFile.path;
//         const base64Image = imageToBase64(imagePath);
//         const mimeType = getImageMimeType(imagePath);

//         if (base64Image) {
//             imageParts.push({
//                 inline_data: {
//                     mime_type: mimeType,
//                     data: base64Image
//                 }
//             });
//         }
//     }

//     try {
//         // Step 1: Validate if the request is fitness-related
//         const validationPrompt = `${VALIDATION_PROMPT}\n\nUser message: "${message}"`;
//         const validationResponse = await callGeminiAPI(validationPrompt, imageParts);
        
//         if (!validationResponse) {
//             throw new ApiError(500, "Failed to validate request");
//         }

//         const validationResult = parseJSONResponse(validationResponse);
        
//         if (!validationResult || !validationResult.is_fitness_related) {
//             return res.status(200).json(new ApiResponse({ 
//                 statusCode: 200, 
//                 data: { 
//                     reply: RESTRICTION_MESSAGE,
//                     validation_result: validationResult 
//                 }, 
//                 message: "Request not related to fitness topics" 
//             })); 
//         }

//         // Step 2: Determine the type of request and use appropriate prompt
//         const isFoodRequest = isFoodAnalysisRequest(message, !!imageFile);
//         let aiResponse;
        
//         if (isFoodRequest) {
//             // Use nutrition analysis prompt for food-related queries
//             const nutritionPrompt = `${NUTRITION_ANALYSIS_PROMPT}\n\nUser query: "${message}"`;
//             const nutritionResponse = await callGeminiAPI(nutritionPrompt, imageParts);
            
//             const nutritionData = parseJSONResponse(nutritionResponse);
            
//             if (nutritionData) {
//                 // Format the nutrition response for better readability
//                 aiResponse = formatNutritionResponse(nutritionData);
//             } else {
//                 aiResponse = "🍎 I couldn't analyze the nutritional information properly. Please try with a clearer image or more specific question about the food item.";
//             }
//         } else {
//             // Use fitness chat prompt for general fitness queries
//             const fitnessPrompt = `${FITNESS_CHAT_PROMPT}\n\nUser query: "${message}"\n\nChat history context: ${JSON.stringify(history.slice(-3))}`;
//             const fitnessResponse = await callGeminiAPI(fitnessPrompt);
            
//             const fitnessData = parseJSONResponse(fitnessResponse);
            
//             if (fitnessData) {
//                 aiResponse = formatFitnessResponse(fitnessData);
//             } else {
//                 aiResponse = "💪 I'm here to help with your fitness journey! Could you please rephrase your question?";
//             }
//         }

//         return res.status(200).json(new ApiResponse({ 
//             statusCode: 200, 
//             data: { 
//                 reply: aiResponse,
//                 request_type: isFoodRequest ? 'nutrition_analysis' : 'fitness_chat',
//                 validation_passed: true
//             }, 
//             message: "Chat response generated successfully" 
//         })); 

//     } catch (error) {
//         console.error('Gemini API Error:', error.response?.data || error.message);
//         throw new ApiError(500, "Failed to generate chat response");
//     } finally {
//         // Clean up uploaded file
//         if (imagePath && fs.existsSync(imagePath)) {
//             try {
//                 fs.unlinkSync(imagePath);
//             } catch (unlinkError) {
//                 console.error('Error deleting uploaded file:', unlinkError);
//             }
//         }
//     }
// }); 

// // Helper function to format nutrition response
// const formatNutritionResponse = (data) => {
//     if (!data.food_identified) {
//         return `🔍 I couldn't identify the specific food item. ${data.fitness_advice || 'Please try with a clearer image or tell me what food you\'d like to know about!'} 💪`;
//     }

//     const nutrition = data.nutrition_per_100g;
//     let response = `🍎 **${data.food_name}** - Nutritional Analysis\n\n`;
    
//     response += `📊 **Per 100g:**\n`;
//     response += `• Calories: ${nutrition.calories} kcal\n`;
//     response += `• Protein: ${nutrition.protein}g 💪\n`;
//     response += `• Carbs: ${nutrition.carbohydrates}g ⚡\n`;
//     response += `• Fat: ${nutrition.fat}g 🥑\n`;
//     response += `• Fiber: ${nutrition.fiber}g 🌾\n`;
//     response += `• Sugar: ${nutrition.sugar}g 🍯\n`;
//     response += `• Sodium: ${nutrition.sodium}mg 🧂\n\n`;

//     if (data.health_benefits && data.health_benefits.length > 0) {
//         response += `✨ **Health Benefits:** ${data.health_benefits.join(', ')}\n\n`;
//     }

//     if (data.fitness_advice) {
//         response += `🏋️ **Fitness Advice:** ${data.fitness_advice}\n\n`;
//     }

//     if (data.portion_recommendations) {
//         response += `🍽️ **Portion Recommendations:**\n`;
//         if (data.portion_recommendations.pre_workout) {
//             response += `• Pre-workout: ${data.portion_recommendations.pre_workout}\n`;
//         }
//         if (data.portion_recommendations.post_workout) {
//             response += `• Post-workout: ${data.portion_recommendations.post_workout}\n`;
//         }
//         if (data.portion_recommendations.general) {
//             response += `• General: ${data.portion_recommendations.general}\n`;
//         }
//     }

//     if (data.allergens && data.allergens.length > 0) {
//         response += `\n⚠️ **Potential Allergens:** ${data.allergens.join(', ')}`;
//     }

//     return response;
// };

// // Helper function to format fitness response
// const formatFitnessResponse = (data) => {
//     let response = `${data.main_response}\n\n`;

//     if (data.quick_tips && data.quick_tips.length > 0) {
//         response += `💡 **Quick Tips:**\n${data.quick_tips.map(tip => `• ${tip}`).join('\n')}\n\n`;
//     }

//     if (data.equipment_needed && data.equipment_needed !== 'none') {
//         response += `🏋️ **Equipment:** ${Array.isArray(data.equipment_needed) ? data.equipment_needed.join(', ') : data.equipment_needed}\n`;
//     }

//     if (data.estimated_time) {
//         response += `⏱️ **Time:** ${data.estimated_time}\n`;
//     }

//     if (data.difficulty_level) {
//         response += `📈 **Level:** ${data.difficulty_level}\n`;
//     }

//     return response.trim();
// };

// export { chat };

































// // Done


// import { asyncHandler } from "../utils/asyncHandler.js"; 
// import { ApiError } from "../utils/ApiError.js"; 
// import { ApiResponse } from "../utils/ApiResponse.js"; 
// import { GEMINI_API_URL } from "../constants.js"; 
// import axios from "axios"; 
// import fs from "fs";
// import path from "path";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

// const RESTRICTION_MESSAGE = 
//     "💪 I can only assist with fitness, gym, workout, nutrition, health, and wellness-related topics. Please ask about exercises, training routines, diet plans, gym equipment, health advice, or food nutrition analysis!"; 

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
//     const { message, history: historyString } = req.body; 
//     const imageFile = req.file; // Image file from multer

//     if (!message) { 
//         throw new ApiError(400, "Message is required"); 
//     } 

//     // Parse history if it's a string (from form-data)
//     let history;
//     try {
//         if (typeof historyString === 'string') {
//             history = JSON.parse(historyString);
//         } else {
//             history = historyString;
//         }
//     } catch (error) {
//         throw new ApiError(400, "Invalid history format. Must be a valid JSON array");
//     }

//     if (!history || !Array.isArray(history)) { 
//         throw new ApiError(400, "History must be an array"); 
//     } 

//     // Create the JSON prompt for validation and response
//     const jsonPrompt = `
// You are a specialized fitness and nutrition AI assistant. Your task is to:

// 1. FIRST: Analyze if the user's message and/or image is related to ANY of these topics:
//    - Fitness and exercise
//    - Gym workouts and equipment
//    - Nutrition and food analysis
//    - Health and wellness
//    - Diet planning
//    - Bodybuilding and muscle building
//    - Weight loss/gain
//    - Sports and physical activities
//    - Food nutritional content analysis
//    - Meal planning for fitness goals

// 2. SECOND: If relevant, provide a helpful response with emojis. If not relevant, decline politely.

// IMPORTANT: Food images and nutrition analysis requests are ALWAYS considered fitness-related topics.

// Please respond in this exact JSON format:
// {
//     "is_fitness_related": boolean,
//     "confidence_score": number (1-10),
//     "detected_topics": ["topic1", "topic2"],
//     "reason": "explanation of why it is or isn't fitness related",
//     "response": "your actual response to the user (only if is_fitness_related is true, otherwise empty string)"
// }

// User's message: "${message}"
// ${imageFile ? "User has also provided an image for analysis." : "No image provided."}
// `;

//     // Format chat history for context (simplified for the main prompt)
//     const contextHistory = history.slice(-3).map((msg) => 
//         `${msg.role}: ${msg.content}`
//     ).join('\n');

//     // Prepare the current message parts
//     let messageParts = [{ 
//         text: `${contextHistory ? 'Previous context:\n' + contextHistory + '\n\n' : ''}${jsonPrompt}` 
//     }];

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

//     try {
//         // Single API call with JSON prompting
//         const response = await axios.post( 
//             `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, 
//             { 
//                 contents: [{
//                     role: "user", 
//                     parts: messageParts 
//                 }],
//                 generationConfig: {
//                     temperature: 0.3
//                 }
//             } 
//         ); 

//         const aiResponse = response.data.candidates[0]?.content?.parts[0]?.text || 
//             "Sorry, I couldn't process that.";

//         // Parse the JSON response
//         let parsedResponse;
//         try {
//             // Clean the response to extract JSON
//             const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
//             if (jsonMatch) {
//                 parsedResponse = JSON.parse(jsonMatch[0]);
//             } else {
//                 throw new Error("No JSON found in response");
//             }
//         } catch (parseError) {
//             console.error('JSON parsing error:', parseError);
//             // Fallback response
//             parsedResponse = {
//                 is_fitness_related: false,
//                 confidence_score: 1,
//                 detected_topics: [],
//                 reason: "Unable to parse AI response",
//                 response: ""
//             };
//         }

//         // Determine final reply
//         const finalReply = parsedResponse.is_fitness_related && parsedResponse.response 
//             ? parsedResponse.response 
//             : RESTRICTION_MESSAGE;

//         // Return response with validation details
//         return res.status(200).json(new ApiResponse({ 
//             statusCode: 200, 
//             data: { 
//                 reply: finalReply,
//                 validation_result: {
//                     is_fitness_related: parsedResponse.is_fitness_related,
//                     confidence_score: parsedResponse.confidence_score,
//                     detected_topics: parsedResponse.detected_topics,
//                     reason: parsedResponse.reason
//                 }
//             }, 
//             message: parsedResponse.is_fitness_related 
//                 ? "Chat response generated successfully" 
//                 : "Request not related to fitness topics",
//             success: true
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

































// controllers/chatbot.controller.js
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { ApiError } from "../utils/ApiError.js"; 
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { GEMINI_API_URL } from "../constants.js"; 
import axios from "axios"; 
import fs from "fs";
import path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

const RESTRICTION_MESSAGE = 
    "💪 I can only assist with fitness, gym, workout, nutrition, health, and wellness-related topics. Please ask about exercises, training routines, diet plans, gym equipment, health advice, or food nutrition analysis!"; 

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

// Function to clean up uploaded files
const cleanupFiles = (files) => {
    if (!files) return;
    
    const filesToClean = Array.isArray(files) ? files : [files];
    filesToClean.forEach(file => {
        if (file && fs.existsSync(file.path)) {
            try {
                fs.unlinkSync(file.path);
            } catch (error) {
                console.error('Error deleting uploaded file:', error);
            }
        }
    });
};

const chat = asyncHandler(async (req, res) => { 
    const { message, history: historyString } = req.body; 
    const imageFiles = req.files || []; // Multiple image files from multer

    if (!message) { 
        throw new ApiError(400, "Message is required"); 
    }

    // Check if more than 5 images are uploaded
    if (imageFiles.length > 5) {
        // Clean up uploaded files
        cleanupFiles(imageFiles);
        throw new ApiError(400, "Maximum 5 images allowed. Please upload up to 5 food photos only.");
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
        cleanupFiles(imageFiles);
        throw new ApiError(400, "Invalid history format. Must be a valid JSON array");
    }

    if (!history || !Array.isArray(history)) { 
        cleanupFiles(imageFiles);
        throw new ApiError(400, "History must be an array"); 
    } 

    // Create the JSON prompt for nutrition analysis
    const jsonPrompt = `
You are a specialized nutrition analysis AI. Your task is to:

1. FIRST: Analyze if the user's message and/or images are related to ANY of these topics:
   - Fitness and exercise
   - Gym workouts and equipment
   - Nutrition and food analysis
   - Health and wellness
   - Diet planning
   - Bodybuilding and muscle building
   - Weight loss/gain
   - Sports and physical activities
   - Food nutritional content analysis
   - Meal planning for fitness goals

2. SECOND: If the request is fitness-related AND contains food images, provide ONLY the exact JSON response format below. If it's fitness-related but not food analysis, provide a helpful response. If not fitness-related, decline politely.

IMPORTANT RULES:
- Food images and nutrition analysis requests are ALWAYS considered fitness-related topics
- For food analysis, respond with ONLY the exact JSON format specified below
- Calculate the SUM of all nutritional values from ALL food items shown in the images
- Don't ask questions, just provide the nutritional information
- Use standard serving sizes for calculations

For food analysis, respond with this EXACT JSON format and nothing else:
{
    "is_fitness_related": true,
    "food_analysis": {
        "food-names": "comma,separated,food,names",
        "calories": number,
        "carbs": number,
        "protein": number,
        "sugar": number,
        "fat": number
    }
}

For non-food fitness topics, respond in this format:
{
    "is_fitness_related": boolean,
    "confidence_score": number (1-10),
    "detected_topics": ["topic1", "topic2"],
    "reason": "explanation",
    "response": "your helpful response with emojis"
}

For non-fitness topics, respond:
{
    "is_fitness_related": false,
    "confidence_score": number (1-10),
    "detected_topics": [],
    "reason": "explanation of why it's not fitness related",
    "response": ""
}

User's message: "${message}"
${imageFiles.length > 0 ? `User has provided ${imageFiles.length} image(s) for analysis.` : "No images provided."}
`;

    // Format chat history for context (simplified for the main prompt)
    const contextHistory = history.slice(-3).map((msg) => 
        `${msg.role}: ${msg.content}`
    ).join('\n');

    // Prepare the current message parts
    let messageParts = [{ 
        text: `${contextHistory ? 'Previous context:\n' + contextHistory + '\n\n' : ''}${jsonPrompt}` 
    }];

    // Process multiple images if provided
    if (imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
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
        }

        // Clean up uploaded files after processing
        cleanupFiles(imageFiles);
    }

    try {
        // Single API call with JSON prompting
        const response = await axios.post( 
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, 
            { 
                contents: [{
                    role: "user", 
                    parts: messageParts 
                }],
                generationConfig: {
                    temperature: 0.2, // Lower temperature for more consistent JSON output
                    maxOutputTokens: 1000,
                }
            } 
        ); 

        const aiResponse = response.data.candidates[0]?.content?.parts[0]?.text || 
            "Sorry, I couldn't process that.";

        // Parse the JSON response
        let parsedResponse;
        try {
            // Clean the response to extract JSON
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedResponse = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            console.error('Raw AI response:', aiResponse);
            
            // Fallback response
            parsedResponse = {
                is_fitness_related: false,
                confidence_score: 1,
                detected_topics: [],
                reason: "Unable to parse AI response",
                response: ""
            };
        }

        // Determine final reply based on response type
        let finalReply;
        let responseMessage;

        if (parsedResponse.is_fitness_related && parsedResponse.food_analysis) {
            // Food analysis case - return the exact JSON format requested
            finalReply = parsedResponse.food_analysis;
            responseMessage = "Food nutrition analysis completed successfully";
        } else if (parsedResponse.is_fitness_related && parsedResponse.response) {
            // Other fitness topics
            finalReply = parsedResponse.response;
            responseMessage = "Chat response generated successfully";
        } else {
            // Not fitness related
            finalReply = RESTRICTION_MESSAGE;
            responseMessage = "Request not related to fitness topics";
        }

        // Return response
        return res.status(200).json(new ApiResponse({ 
            statusCode: 200, 
            data: { 
                reply: finalReply,
                ...(parsedResponse.food_analysis ? {} : {
                    validation_result: {
                        is_fitness_related: parsedResponse.is_fitness_related,
                        confidence_score: parsedResponse.confidence_score || 0,
                        detected_topics: parsedResponse.detected_topics || [],
                        reason: parsedResponse.reason || ""
                    }
                })
            }, 
            message: responseMessage,
            success: true
        })); 

    } catch (error) {
        console.error('Gemini API Error:', error.response?.data || error.message);
        
        // Clean up uploaded files in case of error
        cleanupFiles(imageFiles);
        
        throw new ApiError(500, "Failed to generate chat response");
    }
}); 

export { chat };

// "which is this food? how much nutritions i will get from this food? list all"

// "Give me only JSON response which contains all food-names, sum of caleries, sum of  carbs, sum of protine,  sum of sugar,  sum of fat of given all food photos Don't ask anything just give this information"