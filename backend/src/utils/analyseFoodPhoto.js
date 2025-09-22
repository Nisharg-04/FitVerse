import axios from "axios";
import { GEMINI_API_URL } from "../constants.js";
import fs from "fs";
import path from "path";

const imageToBase64 = (imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64String = imageBuffer.toString("base64");
    return base64String;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

// Function to get image mime type
const getImageMimeType = (imagePath) => {
  const ext = path.extname(imagePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return mimeTypes[ext] || "image/jpeg";
};

const generatePrompt = (imagePaths) => {
  let messageParts = [
    {
      text: `
        You are a specialized food nutrition analyzer. Your task is to analyze food photos and provide detailed nutritional information.

        For given photos give JSON response in the following format only

        FORMAT : 
        {
          is_food_photo: boolean
          nutrition: {
            "food_name" : string,
            "calories" : number,
            "carbs" : number,
            "protein" : number,
            "sugar" : number,
            "fat" : number
          }
        }

        food_name should be comma separated if multiple food items are present in the photo
        calories, carbs, protein, sugar, fat should be in grams

        Give only JSON response. No other text.
        Use given format only

        If any of given photo not contain food photo ignore that photo

        If all photos are not food photo make is_food_photo: false and nutrition: null (Do this only if all photos does not contain food)

        If no image is provided make is_food_photo: false and nutrition: null.
      `,
    },
  ];

  if (imagePaths.length > 0) {
    imagePaths.map((imagePath) => {
      const base64Image = imageToBase64(imagePath);
      const mimeType = getImageMimeType(imagePath);

      if (base64Image) {
        messageParts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64Image,
          },
        });
      }
    });
  }

  return messageParts;
};

const analyseFoodPhoto = async (imagePaths) => {
  const messages = generatePrompt(imagePaths);

  const response = await axios
    .post(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      contents: [
        {
          role: "user",
          parts: messages,
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    })
    .catch((error) => {
      console.error(
        "Error communicating with Gemini API:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to analyze food photo");
    });

  const aiResponse =
    response.data.candidates[0]?.content?.parts[0]?.text ||
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
    console.error("JSON parsing error:", parseError);
    console.error("Raw AI response:", aiResponse);

    // Fallback response
    parsedResponse = {
      is_fitness_related: false,
      confidence_score: 1,
      detected_topics: [],
      reason: "Unable to parse AI response",
      response: "",
    };
  }

  return parsedResponse;
};
export { analyseFoodPhoto };
