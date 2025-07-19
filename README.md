# DevOverflow - Stack Overflow Clone with AI Integration

A modern Q&A platform that combines traditional Stack Overflow features with AI-powered assistance. Users can ask questions, provide answers, and leverage AI for content improvement and suggestions.

## Table of Contents
- [Core Features](#core-features)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Frontend Implementation Guide](#frontend-implementation-guide)
- [Getting Started](#getting-started)

## Core Features

### 1. Authentication System
- Email-based registration with verification
- Secure login with JWT tokens
- Protected routes for authenticated users

### 2. Question Management
- Create, read, update, delete questions
- Tag system for categorization
- Voting system (upvote/downvote)
- Search functionality
- Trending tags

### 3. Answer System
- Multiple answers per question
- Answer voting
- Answer acceptance by question author
- Rich text support

### 4. AI Integration
- Powered by Google Gemini Pro
- AI-assisted answers
- Tag suggestions
- Question quality improvements
- Interactive chatbot
In this project, the AI integration is powered by Google's Gemini Pro model. Here are the specific AI features implemented:

1. AI Status and Configuration:
```typescript
GET /api/ai/status
// Checks if AI features are enabled and returns model info
response: {
  aiEnabled: boolean,
  model: "Google Gemini Pro",
  version: string
}
```

2. Interactive Chatbot:
- Uses Gemini Pro for general Q&A
- Supports personal API keys
- Endpoint: `POST /api/ai/chatbot`
- Users can provide their own Gemini API key or use system default
```typescript
body: {
  query: string,        // User's question
  apiKey?: string       // Optional personal Gemini API key
}
```

3. AI-Assisted Answer Generation:
- Helps users write better answers
- Provides suggestions based on question context
- Endpoint: `GET /api/ai/answer-suggestion/:questionId`
```typescript
response: {
  success: boolean,
  suggestion: string    // AI-generated answer suggestion
}
```

4. Smart Tag Suggestions:
- Analyzes question content to suggest relevant tags
- Uses AI to understand context and recommend appropriate tags
- Endpoint: `POST /api/ai/tag-suggestions`
```typescript
body: {
  questionContent: string   // The question text to analyze
}
response: {
  tags: string[]           // AI-suggested tags
}
```

5. Question Quality Improvements:
- Suggests improvements for question clarity
- Provides formatting and structure recommendations
- Endpoint: `POST /api/ai/question-improvements`
```typescript
body: {
  questionContent: string
}
response: {
  suggestions: string    // AI-generated improvement suggestions
}
```

Environment Setup:
```env
AI_ENABLED=true
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

Key Implementation Details:
1. All AI features require authentication
2. API key management:
   - System default key in environment variables
   - Optional personal API keys per user
3. Error handling for AI service unavailability
4. Rate limiting for AI endpoints
5. Fallback mechanisms when AI service is disabled

Integration Points in Frontend:
1. Question Creation:
   - Real-time tag suggestions
   - Quality improvement tips
2. Answer Writing:
   - AI-powered answer suggestions
   - Content improvement recommendations
3. Global Chat:
   - AI chatbot interface
   - Personal API key management
4. Settings:
   - AI feature toggles
   - API key management

Benefits:
1. Improved content quality through AI suggestions
2. Faster question tagging
3. Better answer formulation
4. Interactive help through chatbot
5. Flexible API key management for power users

The AI integration is designed to enhance the user experience without being intrusive, and users can choose to use or ignore AI features as needed.

### 5. Comments
- Add comments to questions and answers
- Vote on comments
- Edit/delete own comments

## API Endpoints

### Authentication Endpoints

#### Register User
```typescript
POST /api/auth/register
body: {
  name: string,
  lastname: string,
  email: string,
  password: string
}
response: {
  success: boolean,
  token: string,
  user: {
    _id: string,
    name: string,
    lastname: string,
    email: string,
    role: string
  }
}
```

#### Login
```typescript
POST /api/auth/login
body: {
  email: string,
  password: string
}
response: {
  success: boolean,
  token: string,
  user: UserObject
}
```

#### Email Verification
```typescript
GET /api/auth/verify/:token
response: {
  success: boolean,
  message: string,
  user: UserObject
}
```

### Question Endpoints

#### Get All Questions
```typescript
GET /api/questions
query: {
  page?: number,
  limit?: number,
  sort?: string,
  tags?: string[]
}
response: {
  success: boolean,
  questions: QuestionObject[]
}
```

#### Create Question
```typescript
POST /api/questions
headers: { Authorization: `Bearer ${token}` }
body: {
  title: string,
  body: string,
  tags: string[]
}
response: {
  success: boolean,
  question: QuestionObject
}
```

#### Search Questions
```typescript
GET /api/questions/search
query: {
  q: string,
  tags?: string[]
}
response: {
  success: boolean,
  data: QuestionObject[]
}
```

#### Vote on Question
```typescript
POST /api/questions/:id/vote
headers: { Authorization: `Bearer ${token}` }
body: {
  vote: 'up' | 'down'
}
response: {
  success: boolean,
  data: QuestionObject
}
```

### Answer Endpoints

#### Create Answer
```typescript
POST /api/answer/:questionId
headers: { Authorization: `Bearer ${token}` }
body: {
  body: string
}
response: {
  success: boolean,
  answer: AnswerObject
}
```

#### Vote on Answer
```typescript
POST /api/answer/:id/vote
headers: { Authorization: `Bearer ${token}` }
body: {
  vote: 'up' | 'down'
}
response: {
  success: boolean,
  message: string
}
```

#### Accept Answer
```typescript
POST /api/answer/:id/accept
headers: { Authorization: `Bearer ${token}` }
response: {
  success: boolean,
  message: string
}
```

### AI Endpoints

#### Check AI Status
```typescript
GET /api/ai/status
response: {
  success: boolean,
  data: {
    aiEnabled: boolean,
    model: string,
    version: string
  }
}
```

#### Get AI Answer Suggestion
```typescript
GET /api/ai/answer-suggestion/:questionId
headers: { Authorization: `Bearer ${token}` }
response: {
  success: boolean,
  suggestion: string
}
```

#### Get Tag Suggestions
```typescript
POST /api/ai/tag-suggestions
headers: { Authorization: `Bearer ${token}` }
body: {
  questionContent: string
}
response: {
  success: boolean,
  tags: string[]
}
```

#### AI Chatbot
```typescript
POST /api/ai/chatbot
headers: { Authorization: `Bearer ${token}` }
body: {
  query: string,
  apiKey?: string  // Optional personal API key
}
response: {
  success: boolean,
  response: string
}
```

### Comment Endpoints

#### Add Comment
```typescript
POST /api/comments/question/:questionId
POST /api/comments/answer/:answerId
headers: { Authorization: `Bearer ${token}` }
body: {
  content: string
}
response: {
  success: boolean,
  data: CommentObject
}
```

## Data Models

### User
```typescript
interface User {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  isVerified: boolean;
}
```

### Question
```typescript
interface Question {
  _id: string;
  title: string;
  body: string;
  tags: string[];
  author: User;
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
  answers: Answer[];
}
```

### Answer
```typescript
interface Answer {
  _id: string;
  body: string;
  author: User;
  question: string;
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
  isAccepted: boolean;
}
```

### Comment
```typescript
interface Comment {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
}
```

## Frontend Implementation Guide

### 1. Authentication Implementation
- Implement protected routes using React Router
- Store JWT token in secure storage (localStorage/cookies)
- Add authorization headers to protected requests
- Handle token expiration and refresh

### 2. State Management
Consider using Redux/Context for:
- User authentication state
- Questions cache
- UI state (loading, errors)

### 3. Required UI Components
- Authentication forms (login/register)
- Question editor (with markdown support)
- Answer editor
- Comment system
- Vote buttons
- Tag input/display
- AI suggestion interface
- Search bar
- Pagination controls

### 4. Error Handling
- Display appropriate error messages
- Form validation
- API error handling
- Loading states

### 5. Real-time Features
- New answer notifications
- Vote count updates
- Comment updates

### 6. AI Integration UI
- AI suggestion toggle
- Tag suggestion interface
- Question improvement prompts
- Chatbot interface

### Implementation Checklist
- [ ] Handle loading states for all API calls
- [ ] Implement proper error handling
- [ ] Add input validation
- [ ] Use proper TypeScript types/interfaces
- [ ] Implement responsive design
- [ ] Add proper SEO meta tags
- [ ] Implement accessibility features
- [ ] Add proper documentation

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Google Gemini Pro API key (for AI features)

### Environment Variables
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AI_ENABLED=true
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

## License
This project is licensed under the MIT License.
