# 🤖 FitVerse AI Chatbot - Quick Reference

## What You Have

✅ **Complete AI Chatbot System**
- Backend: Gemini API integration with strict validation
- Frontend: Beautiful floating widget in bottom-right corner
- Behavior: Answers ONLY fitness, nutrition, and health questions
- UX: Smooth animations, real-time responses, conversation history

---

## Quick Setup (5 Steps)

### Step 1: Get Gemini API Key
```
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create new API key"
3. Copy the key
```

### Step 2: Add to .env
```bash
# In backend/.env
GEMINI_API_KEY=your_api_key_here
```

### Step 3: Verify Backend File
```
backend/src/controllers/chatbot.controller.js ✅
```

### Step 4: Verify Frontend Component
```
frontend/src/components/FitnessAIChatbot.tsx ✅
```

### Step 5: Check App.tsx
```
App.tsx should have:
- import FitnessAIChatbot from "./components/FitnessAIChatbot"
- <FitnessAIChatbot /> in JSX ✅
```

**Done!** Restart your dev server.

---

## File Locations

```
FitVerse/
├── backend/
│   └── src/controllers/
│       └── chatbot.controller.js ⭐ NEW
├── frontend/
│   └── src/components/
│       └── FitnessAIChatbot.tsx ⭐ NEW
└── CHATBOT_SETUP.md ⭐ NEW
```

---

## How It Works

### User Flow:
```
1. User clicks floating button (bottom-right)
2. Types fitness question
3. Presses Enter or clicks Send
4. Message goes to backend API
5. Backend validates with Gemini
6. Gemini generates fitness-focused response
7. Response appears in chat with emoji
8. User can continue conversation
```

### Validation Flow:
```
Is message fitness-related?
├─ YES (has keywords) → Send to Gemini
│  └─ Validate response is fitness-focused
└─ NO (no keywords) → Ask Gemini "Is this fitness?"
   ├─ YES → Send to Gemini
   └─ NO → Reject with friendly message
```

---

## Testing the Chatbot

### Start Dev Server:
```bash
# Frontend
cd frontend && npm run dev

# Backend (in another terminal)
cd backend && npm run dev
```

### Good Questions to Try:
- "What's the best workout for bigger arms?"
- "How many calories should I eat daily?"
- "Can you suggest a meal plan for weight loss?"
- "What's the proper form for deadlifts?"
- "How much protein do I need?"

### Bad Questions (Will Reject):
- "What's 2 + 2?"
- "Tell me a joke"
- "What's the weather like?"

---

## API Endpoint

**URL**: `POST /chatbot/chat`

**Full URL**: `http://localhost:5000/chatbot/chat`

**Headers**:
```
Content-Type: application/json
Cookie: [auth cookies if applicable]
```

**Request Body**:
```json
{
  "message": "How do I build muscle?",
  "history": [
    {
      "role": "user",
      "content": "I want to get fit"
    },
    {
      "role": "assistant",
      "content": "Great goal! Here's what you need..."
    }
  ]
}
```

**Success Response**:
```json
{
  "statusCode": 200,
  "data": {
    "reply": "💪 To build muscle, you need...",
    "isFitnessRelated": true
  },
  "message": "Response generated successfully"
}
```

**Rejection Response**:
```json
{
  "statusCode": 200,
  "data": {
    "reply": "💪 Sorry! I can only help with fitness...",
    "isFitnessRelated": false
  },
  "message": "Message is not fitness-related"
}
```

---

## Frontend Usage

### Component Props:
None! It's self-contained.

### Component Location:
```tsx
// In App.tsx or any parent component
import FitnessAIChatbot from "@/components/FitnessAIChatbot";

// In JSX
<FitnessAIChatbot />
```

### Styling:
- Uses Tailwind CSS (already in your project)
- Uses shadcn/ui components (Button, Input, etc.)
- Respects your app's color scheme (primary, secondary, success)

---

## Environment Variables

**Backend .env**:
```bash
GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxx
```

**Frontend .env.local** (already configured):
```bash
VITE_BACKEND_URL=http://localhost:5000
# or for production: https://your-api.com
```

---

## Features

### ✨ UI Features:
- ✅ Floating button (bottom-right)
- ✅ Smooth open/close animation
- ✅ Chat message display with timestamps
- ✅ Typing indicator (loading state)
- ✅ Auto-scroll to latest message
- ✅ Input field with Enter key support
- ✅ Notification dot (when closed)
- ✅ Responsive design (mobile-friendly)

### 🧠 AI Features:
- ✅ Remembers conversation context
- ✅ Enforces fitness-only responses
- ✅ Provides emoji-rich answers
- ✅ Dual validation (keyword + AI)
- ✅ Natural conversation flow

---

## Customization

### Change Chatbot Name:
```tsx
// In FitnessAIChatbot.tsx, line 25
const [chatName] = useState("FitVerse AI");  // Change this
```

### Add More Fitness Keywords:
```javascript
// In chatbot.controller.js, add to FITNESS_KEYWORDS array
"your-keyword", "another-keyword",
```

### Change Response Style:
```javascript
// In chatbot.controller.js, modify SYSTEM_PROMPT
// Add/remove tone, emoji style, response length guidance
```

### Adjust API Parameters:
```javascript
// In callGeminiAPI function
temperature: 0.7,  // 0 = deterministic, 1 = creative
topK: 40,         // Lower = more focused
topP: 0.95,       // Lower = more deterministic
maxOutputTokens: 1024  // Max response length
```

---

## Troubleshooting

### Chatbot not showing?
- [ ] Check browser console for errors
- [ ] Verify component is in App.tsx
- [ ] Check if Tailwind CSS is loaded

### No responses from AI?
- [ ] Verify GEMINI_API_KEY is set in .env
- [ ] Check backend logs for API errors
- [ ] Verify API key is valid at https://aistudio.google.com
- [ ] Check network tab in DevTools

### API errors?
- [ ] Error 400: Check message format
- [ ] Error 500: Check GEMINI_API_KEY
- [ ] Error 401: Invalid API key
- [ ] Timeout: Check network/API quota

### Messages not appearing?
- [ ] Check browser console for errors
- [ ] Verify API response format
- [ ] Check if conversation state is updating

---

## Code Examples

### Sending from Frontend:
```typescript
const response = await axios.post(
  `${import.meta.env.VITE_BACKEND_URL}/chatbot/chat`,
  {
    message: "How many reps for bicep curls?",
    history: previousMessages
  },
  { withCredentials: true }
);

const aiReply = response.data.data.reply;
```

### Backend Processing:
```javascript
// 1. Check keywords
if (!isFitnessRelated(message)) {
  // 2. Double-check with AI
  const validation = await callGeminiAPI(validationPrompt);
  if (!validation.includes("YES")) {
    return reject();  // Not fitness-related
  }
}

// 3. Generate response
const aiResponse = await callGeminiAPI(contents);

// 4. Return to frontend
return res.json(apiResponse);
```

---

## Performance

**Typical Response Times**:
- Network latency: 100-500ms
- Gemini API: 1-2 seconds
- Total: 1-2.5 seconds

**Monthly API Costs** (estimate):
- Light usage: <$1
- Medium usage: $1-5
- Heavy usage: $5-10

(Gemini API is very affordable)

---

## Next Steps

1. ✅ Setup complete!
2. Test with various questions
3. Deploy to production
4. Monitor API usage
5. Gather user feedback
6. Consider future enhancements

---

## Emergency Reset

If something breaks:

```bash
# Backend - Clear cache and restart
rm -rf node_modules
npm install
npm run dev

# Frontend - Clear cache and restart
rm -rf node_modules
npm install
npm run dev

# Check that GEMINI_API_KEY is in backend/.env
```

---

## Resources

- 📖 [Gemini API Docs](https://ai.google.dev/docs)
- 🎨 [Framer Motion](https://www.framer.com/motion/)
- 📦 [Lucide Icons](https://lucide.dev/)
- 🎯 [shadcn/ui](https://ui.shadcn.com/)

---

## Support Notes

- **Backend Logs**: Check `backend` terminal for detailed errors
- **Frontend Logs**: Check browser DevTools Console
- **API Status**: Use Postman to test `/chatbot/chat` endpoint
- **Rate Limiting**: Implement if needed for production

---

**You're all set! 🚀 Start using your AI chatbot!**

Questions? Check `CHATBOT_SETUP.md` for detailed documentation.
