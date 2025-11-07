import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_PROMPT = `You are FitVerse AI, a friendly and approachable fitness, nutrition, and health expert chatbot. You ONLY answer questions related to:
- Fitness & Workouts (exercises, training routines, workout plans, gym workouts)
- Nutrition & Diet (meal plans, calorie counting, macronutrients, supplements, healthy eating)
- Health & Wellness (body composition, fitness advice, muscle building, weight loss, cardiovascular health)
- Gym & Equipment (gym exercises, equipment usage, training techniques)
- Sports & Physical Activities (sports training, athletic performance)

IMPORTANT GUIDELINES:
1. Be warm, friendly, and encouraging in tone
2. For casual greetings (hi, hello, hey), respond warmly and steer towards fitness topics
3. REJECT general knowledge, math, history, politics, or entertainment questions - but do so politely
4. Always provide fitness-focused, actionable advice with relevant emojis
5. If a question seems unclear, ask clarifying questions rather than reject
6. Keep responses conversational and engaging
7. Encourage users to ask fitness-related questions

Examples of good responses:
- User: "hi" → Response: "Hey there! 💪 Welcome to FitVerse AI! I'm here to help you with workouts, nutrition, fitness tips, and health advice. What fitness goal are you working towards?"
- User: "tell me a joke" → Response: "I'm not great at jokes, but I can definitely help you get fit and strong! 💪 How about we chat about your fitness goals instead? What are you interested in - workouts, nutrition, or something else?"`;

const FITNESS_KEYWORDS = [
    "workout", "exercise", "gym", "training", "fitness", "workout plan", "routine",
    "sets", "reps", "muscle", "strength", "cardio", "hiit", "running", "cycling",
    "swimming", "yoga", "pilates", "crossfit", "bodybuilding", "powerlifting",
    "nutrition", "calories", "macros", "protein", "carbs", "fat", "meal plan",
    "diet", "food", "nutrition facts", "meal", "snack", "breakfast", "lunch",
    "dinner", "supplement", "vitamin", "mineral", "hydration", "water intake",
    "health", "body", "weight loss", "gain weight", "muscle gain", "fat loss",
    "body composition", "BMI", "metabolism", "injury", "recovery", "sleep",
    "heart rate", "blood pressure", "wellness", "lifestyle", "healthy",
    "bench press", "squat", "deadlift", "dumbbell", "barbell", "kettlebell",
    "resistance band", "treadmill", "elliptical", "rowing", "lat pulldown",
    "bicep", "tricep", "abs", "core", "glutes", "quads", "hamstring", "stretch",
];

// Greeting keywords - allow these even if not fitness-related
const GREETING_KEYWORDS = [
    "hi", "hello", "hey", "greetings", "what's up", "howdy", "good morning", "good afternoon", 
    "good evening", "sup", "yo", "hiya", "morning", "evening", "afternoon"
];

const isFitnessRelated = (message) => {
    const lowerMessage = message.toLowerCase();
    return FITNESS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

const isGreeting = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    return GREETING_KEYWORDS.some(keyword => lowerMessage.includes(keyword)) || lowerMessage.length < 10;
};

const callGeminiAPI = async (contents) => {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const aiResponse =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response. Please try again.";
        return aiResponse;
    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        throw new ApiError(500, "Failed to generate AI response");
    }
};

const chat = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
        throw new ApiError(400, "Message is required and must be a string");
    }

    let chatHistory = [];
    if (history && Array.isArray(history)) {
        chatHistory = history.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));
    }

    try {
        // Allow greetings and fitness-related messages to go straight to Gemini
        const isFitness = isFitnessRelated(message);
        const isGreet = isGreeting(message);

        // Only validate non-fitness, non-greeting messages with Gemini
        if (!isFitness && !isGreet) {
            const validationContents = [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Can this question be answered by a fitness and health expert? Be flexible - if it could relate to fitness/health in any way, say YES. Respond with only "YES" or "NO": "${message}"`,
                        },
                    ],
                },
            ];

            const validationResponse = await callGeminiAPI(validationContents);

            if (!validationResponse.includes("YES")) {
                // Friendly rejection message
                return res.status(200).json(
                    new ApiResponse({
                        statusCode: 200,
                        data: {
                            reply: "I appreciate the question! 😊 But I'm specifically designed to help with fitness, nutrition, health, and wellness topics. How about asking me something like 'What's a good workout routine?' or 'How do I eat healthier?' - I'd love to help with that! 💪",
                            isFitnessRelated: false,
                        },
                        message: "Message is not fitness-related",
                    })
                );
            }
        }

        const contents = [
            {
                role: "user",
                parts: [{ text: SYSTEM_PROMPT }],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "Got it! I'm FitVerse AI, your friendly fitness and wellness buddy. I'll help with workouts, nutrition, health tips, and anything fitness-related. I'll also gracefully redirect off-topic questions back to fitness. Let's get started!",
                    },
                ],
            },
            ...chatHistory,
            {
                role: "user",
                parts: [{ text: message }],
            },
        ];

        const aiResponse = await callGeminiAPI(contents);

        return res.status(200).json(
            new ApiResponse({
                statusCode: 200,
                data: {
                    reply: aiResponse,
                    isFitnessRelated: true,
                },
                message: "Response generated successfully",
            })
        );
    } catch (error) {
        console.error("Chat error:", error);
        throw error;
    }
});

export { chat };
