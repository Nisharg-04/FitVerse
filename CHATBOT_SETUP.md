# 🤖 FitVerse AI Chatbot Setup Guide

## Overview
FitVerse now includes a powerful AI-powered chatbot that uses **Google Gemini API** to provide expert fitness, nutrition, and health advice. The chatbot appears in the **bottom-right corner** of the app and answers ONLY fitness and health-related questions.

## Features

✅ **Fitness-Focused Only**
- Answers questions about workouts, exercises, training routines
- Provides nutrition and diet advice
- Discusses health, wellness, body composition, muscle building
- Gym equipment and techniques
- Rejects vague or off-topic questions

✅ **Conversation Memory**
- Maintains chat history within the session
- Provides contextual responses based on previous messages

✅ **Beautiful UI**
- Floating button in bottom-right corner
- Smooth animations and transitions
- Responsive design (works on mobile and desktop)
- Modern gradient design matching FitVerse theme
- Live typing indicator when AI is thinking

✅ **Double Validation**
- Keyword-based initial check
- AI-powered validation using Gemini to ensure fitness relevance
- Rejects generic or off-topic questions with helpful message

## Backend Setup

### 1. Environment Configuration
Ensure your `.env` file includes:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Controller File
Location: `backend/src/controllers/chatbot.controller.js`

**Key Features:**
- Uses Gemini 1.5 Flash model for fast responses
- Implements strict system prompt to enforce fitness-only discussions
- Maintains conversation context through chat history
- Validates messages before and after AI generation

**API Endpoint:** `POST /chatbot/chat`

**Request Body:**
```json
{
  "message": "How many sets and reps should I do for bicep curls?",
  "history": [
    {
      "role": "user",
      "content": "I want to build bigger biceps"
    },
    {
      "role": "assistant",
      "content": "Great goal! Here's what you need to do..."
    }
  ]
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "reply": "💪 For bicep curls, aim for 3-4 sets of 8-12 reps with moderate weight...",
    "isFitnessRelated": true
  },
  "message": "Response generated successfully"
}
```

### 3. Routes
Location: `backend/src/routes/chatbot.routes.js`

```javascript
router.route("/chat").post(
  // verifyJWT, // Uncomment if authentication is required
  chat
);
```

## Frontend Setup

### 1. Component File
Location: `frontend/src/components/FitnessAIChatbot.tsx`

**Features:**
- Floating chat button in bottom-right corner
- Expandable chat window with message history
- Real-time message display with timestamps
- Loading state with animated spinner
- Smooth animations using Framer Motion
- Scrollable message area
- Input field with Enter key support

### 2. Integration in App
The chatbot is already integrated in `App.tsx`:
```tsx
import FitnessAIChatbot from "./components/FitnessAIChatbot";

// Inside the App component:
<FitnessAIChatbot />
```

### 3. Usage
The chatbot appears as:
- **Closed State**: Floating circular button in bottom-right (MessageCircle icon)
- **Open State**: Full chat window with header, message area, and input field
- **Active Indicator**: Pulsing green dot on the floating button when closed

## Testing the Chatbot

### Good Questions (Will be answered):
- "What's the best chest workout routine?"
- "How many calories should I eat to lose weight?"
- "What's the difference between aerobic and anaerobic exercise?"
- "Can you recommend a nutrition plan for muscle building?"
- "How do I perform a proper deadlift?"

### Bad Questions (Will be rejected):
- "What's the capital of France?"
- "Tell me a joke"
- "What's 2 + 2?"
- "Who is the president?"
- Generic questions without fitness context

### Example Interaction:
```
User: What should I eat before a workout?
AI: 🍎 Pre-workout meals should contain... (detailed response with emojis)

User: This is about nutrition right?
AI: Yes! I only help with fitness, nutrition, and health. Would you like more pre-workout meal suggestions?

User: Tell me a joke
AI: 💪 Sorry! I can only help with fitness, nutrition, health, and wellness topics. 
Ask me about workouts, meal plans, nutrition facts, gym routines, or body health!
```

## System Architecture

### Backend Flow:
1. User sends message from frontend
2. Backend receives message + chat history
3. Check if message is fitness-related (keyword check)
4. If not, validate with Gemini AI
5. If validated as fitness-related, generate response using system prompt
6. Verify response is fitness-focused
7. Return response to frontend

### Frontend Flow:
1. User types message and presses Enter
2. Add message to UI with timestamp
3. Disable input and show loading state
4. Send to backend API
5. Receive AI response
6. Add AI response to message history with timestamp
7. Scroll to latest message
8. Enable input for next message

## Configuration Options

### Temperature Settings (in controller)
```javascript
temperature: 0.7,  // Balanced creativity vs consistency
topK: 40,         // Top-40 tokens considered
topP: 0.95,       // Nucleus sampling
maxOutputTokens: 1024  // Max response length
```

### Fitness Keywords
Customize the keyword list in `chatbot.controller.js` to add more fitness topics or filter criteria.

## Troubleshooting

### Issue: Chatbot not responding
- Check GEMINI_API_KEY is set in .env
- Verify API key is valid and has quota remaining
- Check backend logs for Gemini API errors

### Issue: Chatbot accepting off-topic questions
- This is working as designed - the dual-validation system is active
- Try asking a more clearly fitness-related question
- Check the console for validation details

### Issue: Slow responses
- Gemini 1.5 Flash is fast, but may take 2-3 seconds
- Check network connection
- Verify API quotas haven't been exceeded

### Issue: Messages not showing timestamps
- Check timezone settings in browser
- Ensure date-fns is properly imported

## Future Enhancements

🔮 Possible improvements:
- Multi-language support
- Voice input/output
- Integration with user's fitness data
- Personalized recommendations based on user profile
- Export chat history
- Favorite responses
- Ratings/feedback on responses
- Admin dashboard to monitor chatbot usage

## Files Created/Modified

**New Files:**
- `frontend/src/components/FitnessAIChatbot.tsx` - Main chatbot component
- `backend/src/controllers/chatbot.controller.js` - Rewritten with Gemini integration

**Modified Files:**
- `frontend/src/App.tsx` - Added FitnessAIChatbot import and component
- `backend/src/routes/chatbot.routes.js` - Already configured for the new controller

## API Integration

### Gemini API Details:
- **Model**: gemini-1.5-flash (fast, efficient)
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Authentication**: API key in query parameter

### Cost Optimization:
- Using flash model for faster, cheaper responses
- Efficient token usage with focused prompts
- Conversation context passed only when needed

## Security Considerations

✅ **Best Practices Implemented:**
- Server-side validation of messages
- System prompt prevents jailbreaking
- No personal data stored in conversation
- Input sanitization via Gemini
- API key protected in backend .env

⚠️ **Recommendations:**
- Consider adding authentication (uncomment verifyJWT in routes)
- Rate-limit API calls to prevent abuse
- Log conversations for moderation (if needed)
- Regular monitoring of API usage

---

## Quick Start Checklist

- [x] Set GEMINI_API_KEY in backend .env
- [x] Backend controller configured
- [x] Frontend component created and integrated
- [x] Routes configured
- [x] Chatbot appears in app bottom-right corner
- [x] Can send and receive messages
- [x] Validates fitness-related content
- [x] Shows proper error messages for off-topic questions

**Status**: ✅ Ready to use!
