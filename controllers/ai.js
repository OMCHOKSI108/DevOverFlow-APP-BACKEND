const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

const aiEnabled = process.env.AI_ENABLED === 'true';

// Placeholder for a real Google Gemini API call
const getGeminiResponse = async (query, apiKey) => {
    if (!apiKey) {
        throw new Error('Google Gemini API Key is missing.');
    }
    // In a real application, you would use the 'apiKey' to make a request to the Gemini API
    // e.g., const response = await gemini.generateContent({ prompt: query, key: apiKey });
    console.log(`Making AI call with key ending in...${apiKey.slice(-4)}`);
    return `This is a mock response from Gemini for the query: "${query}"`;
};

// @desc    Interact with the AI Chatbot
// @route   POST /api/ai/chatbot
exports.chatbot = asyncHandler(async (req, res, next) => {
    if (!aiEnabled) {
        return next(new ErrorResponse('AI features are currently disabled.', 503));
    }
    const { query, apiKey } = req.body;
    if (!query) {
        return next(new ErrorResponse('Please provide a query for the chatbot.', 400));
    }

    // Get the user from the DB to check/save their API key
    const user = await User.findById(req.user.id).select('+geminiApiKey');
    let userApiKey = user.geminiApiKey;
    
    // If a new key is provided, save it to the user's profile
    if (apiKey) {
        user.geminiApiKey = apiKey;
        await user.save();
        userApiKey = apiKey;
    }
    
    // Use the user's saved key, or fall back to the one in .env
    const keyToUse = userApiKey || process.env.GOOGLE_GEMINI_API_KEY;

    if (!keyToUse) {
        return next(new ErrorResponse('An API key is required for this feature. Please provide one.', 400));
    }
    
    try {
        const response = await getGeminiResponse(query, keyToUse);
        res.status(200).json({ success: true, response });
    } catch(err) {
        return next(new ErrorResponse('Failed to get a response from the AI service.', 500));
    }
});


exports.getAiStatus = asyncHandler(async (req, res, next) => {
    res.status(200).json({ success: true, data: { aiEnabled, model: 'Google Gemini Pro', version: '1.0' } });
});
// --- Other AI Controller stubs remain the same for now ---
exports.getAnswerSuggestion = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, suggestion: "AI suggests: The answer might be 42." }));
exports.createAiAnswer = asyncHandler(async (req, res, next) => res.status(201).json({ success: true, data: `AI created answer for question ${req.params.id}` }));
exports.getTagSuggestions = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, tags: ['ai-suggestion-1', 'ai-suggestion-2'] }));
exports.getQuestionImprovements = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, suggestions: 'AI suggests improving the title and adding a code block.' }));