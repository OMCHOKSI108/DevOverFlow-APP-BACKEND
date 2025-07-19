const asyncHandler = require('../middleware/async');

/**
 * @desc    Get API Documentation
 * @route   GET /api
 * @access  Public
 */
const getApiEndpoints = asyncHandler(async (req, res, next) => {
    // Handle OPTIONS request for documentation
    if (req.method === 'OPTIONS') {
        return res.status(200).json({
            success: true,
            endpoint: '/api',
            method: 'GET',
            description: 'Get API documentation and endpoint listing',
            features: [
                '📚 Complete API documentation',
                '🔍 Detailed endpoint listing',
                '📱 Mobile feature showcase',
                '⚡ Tech stack information'
            ],
            returns: 'API documentation with all endpoints and features'
        });
    }

    // Main API documentation
    res.status(200).json({
        success: true,
        message: "🚀 Welcome to DevOverflow API - Mobile Ready!",
        version: "2.0.0",
        description: "A modern Q&A platform for developers",
        endpoints: {
            "🔐 Authentication": {
                base: "/api/auth",
                routes: {
                    "register": "/api/auth/register",
                    "login": "/api/auth/login",
                    "verify": "/api/auth/verify/:token",
                    "forgot-password": "/api/auth/forgotPassword",
                    "reset-password": "/api/auth/resetPassword",
                    "me": "/api/auth/me"
                }
            },
            "👥 Users & Friends": {
                base: "/api/users",
                routes: {
                    "get-all": "/api/users",
                    "get-one": "/api/users/:id"
                }
            },
            "❓ Questions": {
                base: "/api/questions",
                routes: {
                    "list": "/api/questions",
                    "create": "/api/questions",
                    "get": "/api/questions/:id",
                    "search": "/api/questions/search",
                    "trending-tags": "/api/questions/tags/trending",
                    "vote": "/api/questions/:id/vote"
                }
            },
            "💬 Answers": {
                base: "/api/answer",
                routes: {
                    "create": "/api/answer/:questionId",
                    "update": "/api/answer/:id",
                    "delete": "/api/answer/:id",
                    "vote": "/api/answer/:id/vote",
                    "accept": "/api/answer/:id/accept"
                }
            },
            "📝 Comments": {
                base: "/api/comments",
                routes: {
                    "question-comments": "/api/comments/question/:questionId",
                    "answer-comments": "/api/comments/answer/:answerId",
                    "vote": "/api/comments/:id/vote"
                }
            },
            "🤖 AI Features": {
                base: "/api/ai",
                routes: {
                    "status": "/api/ai/status",
                    "answer-suggestion": "/api/ai/answer-suggestion/:id",
                    "tag-suggestions": "/api/ai/tag-suggestions",
                    "chatbot": "/api/ai/chatbot"
                }
            },
            "📁 File Upload": {
                base: "/api/upload",
                routes: {
                    "config": "/api/upload/config",
                    "single": "/api/upload/single",
                    "profile": "/api/upload/profile"
                }
            },
            "⚙️ Admin": {
                base: "/api/admin",
                routes: {
                    "users": "/api/admin/users",
                    "questions": "/api/admin/questions",
                    "stats": "/api/admin/stats"
                }
            }
        },
        mobile_features: [
            "📱 Push Notifications Ready",
            "🔍 Search with Auto-complete",
            "🏷️ AI Tag Suggestions",
            "🤖 AI Answer Generation",
            "📊 Trending Content",
            "🔖 Bookmark Management",
            "👤 Enhanced User Profiles",
            "🎨 Dark Mode Support",
            "📁 File Upload with Uploadcare",
            "⚡ Real-time Updates"
        ],
        tech_stack: {
            backend: "Node.js + Express.js",
            database: "MongoDB Atlas",
            auth: "JWT",
            ai: "Google Gemini Pro",
            storage: "Uploadcare CDN",
            mobile: "REST API optimized"
        },
        docs_tip: "💡 Send OPTIONS request to any endpoint for detailed documentation"
    });
});

module.exports = {
    getApiEndpoints
};
