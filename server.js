const express = require('express');
const dotenv = require('dotenv');
const morgan =require('morgan');
const path = require('path');
const winston = require('winston');

// Load env vars
dotenv.config();

// Route files
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const questionsRoutes = require('./routes/questions');
const answersRoutes = require('./routes/answers');
const commentsRoutes = require('./routes/comments');
const aiRoutes = require('./routes/ai');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/error');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Winston Logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});
global.logger = logger;

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/answer', answersRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler MUST be after mounting routers
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
