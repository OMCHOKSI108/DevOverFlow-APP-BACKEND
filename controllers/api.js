const asyncHandler = require('../middleware/async');

// @desc      Get API endpoints documentation
// @route     GET /api
// @access    Public
exports.getApiEndpoints = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "🚀 Welcome to DevOverflow API - Mobile Ready!",
        version: "2.0.0",
        description: "A modern Q&A platform for developers",
        endpoints: {
            "🔐 Authentication": "/api/auth",
            "👥 Users & Friends": "/api/users",
            "❓ Questions": "/api/questions",
            "💬 Answers": "/api/answer",
            "📝 Comments": "/api/comments",
            "🤖 AI Features": "/api/ai",
            "📁 File Upload": "/api/upload",
            "⚙️ Admin": "/api/admin",
            "🗄️ Database Viewer": "/api/database",
            details: {
                auth: {
                    login: {
                        endpoint: "/api/auth/login",
                        method: "POST",
                        description: "Login user",
                        body: {
                            email: "string",
                            password: "string"
                        }
                    },
                    verify: {
                        endpoint: "/api/auth/verify/:token",
                        method: "GET",
                        description: "Verify user email"
                    },
                    forgotPassword: {
                        endpoint: "/api/auth/forgotPassword",
                        method: "POST",
                        description: "Request password reset",
                        body: {
                            email: "string"
                        }
                    },
                    resetPassword: {
                        endpoint: "/api/auth/resetPassword",
                        method: "POST",
                        description: "Reset password",
                        body: {
                            token: "string",
                            new_password: "string",
                            confirm_password: "string"
                        }
                    },
                    me: {
                        endpoint: "/api/auth/me",
                        method: "GET",
                        description: "Get logged in user",
                        protected: true
                    }
                },
                questions: {
                    list: {
                        endpoint: "/api/questions",
                        method: "GET",
                        description: "Get all questions",
                        query: {
                            page: "number",
                            limit: "number",
                            sort: "string",
                            tags: "string[]"
                        }
                    },
                    create: {
                        endpoint: "/api/questions",
                        method: "POST",
                        description: "Create new question",
                        protected: true,
                        body: {
                            title: "string",
                            body: "string",
                            tags: "string[]"
                        }
                    },
                    get: {
                        endpoint: "/api/questions/:id",
                        method: "GET",
                        description: "Get single question"
                    },
                    vote: {
                        endpoint: "/api/questions/:id/vote",
                        method: "POST",
                        description: "Vote on question",
                        protected: true,
                        body: {
                            vote: "'up' | 'down'"
                        }
                    },
                    search: {
                        endpoint: "/api/questions/search",
                        method: "GET",
                        description: "Search questions",
                        query: {
                            q: "string",
                            tags: "string[]"
                        }
                    }
                },
                answers: {
                    create: {
                        endpoint: "/api/answer/:questionId",
                        method: "POST",
                        description: "Add answer to question",
                        protected: true,
                        body: {
                            body: "string"
                        }
                    },
                    vote: {
                        endpoint: "/api/answer/:id/vote",
                        method: "POST",
                        description: "Vote on answer",
                        protected: true,
                        body: {
                            vote: "'up' | 'down'"
                        }
                    },
                    accept: {
                        endpoint: "/api/answer/:id/accept",
                        method: "POST",
                        description: "Accept answer",
                        protected: true
                    }
                },
                ai: {
                    status: {
                        endpoint: "/api/ai/status",
                        method: "GET",
                        description: "Check AI service status"
                    },
                    answerSuggestion: {
                        endpoint: "/api/ai/answer-suggestion/:questionId",
                        method: "GET",
                        description: "Get AI-generated answer suggestion",
                        protected: true
                    },
                    tagSuggestions: {
                        endpoint: "/api/ai/tag-suggestions",
                        method: "POST",
                        description: "Get AI-suggested tags",
                        protected: true,
                        body: {
                            questionContent: "string"
                        }
                    },
                    chatbot: {
                        endpoint: "/api/ai/chatbot",
                        method: "POST",
                        description: "Interact with AI chatbot",
                        protected: true,
                        body: {
                            query: "string",
                            apiKey: "string (optional)"
                        }
                    }
                },
                comments: {
                    questionComment: {
                        endpoint: "/api/comments/question/:questionId",
                        method: "POST",
                        description: "Add comment to question",
                        protected: true,
                        body: {
                            content: "string"
                        }
                    },
                    answerComment: {
                        endpoint: "/api/comments/answer/:answerId",
                        method: "POST",
                        description: "Add comment to answer",
                        protected: true,
                        body: {
                            content: "string"
                        }
                    }
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
        }
    });
});
