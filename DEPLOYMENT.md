# Deployment Guide

## Pre-deployment Checklist

### 1. Environment Variables
Make sure these are set in Render's environment variables:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
AI_ENABLED=true
GOOGLE_GEMINI_API_KEY=your_production_api_key
```

### 2. Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Network access configured (IP whitelist or allow all)
- [ ] Database user created with proper permissions
- [ ] Connection string copied to MONGODB_URI env var

### 3. Code Changes Required

#### a. CORS Configuration
```javascript
// In your Express app
app.use(cors({
  origin: ['https://your-frontend-domain.com', 'https://your-api-domain.onrender.com'],
  credentials: true
}));
```

#### b. Security Headers
```javascript
// Add security headers
app.use(helmet());
```

#### c. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

### 4. Performance Optimizations
- [ ] Implement caching where appropriate
- [ ] Add compression middleware
- [ ] Enable gzip compression in Express

```javascript
const compression = require('compression');
app.use(compression());
```

### 5. Monitoring Setup
- [ ] Error tracking service configured (e.g., Sentry)
- [ ] Logging service setup
- [ ] Health check endpoint added

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});
```

## Deployment Steps

1. **Prepare Your Repository**
   ```bash
   # Ensure all dependencies are in package.json
   npm install --save compression helmet express-rate-limit
   
   # Add start script to package.json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. **Configure Render Service**
   - Create new Web Service
   - Connect your GitHub repository
   - Select the branch to deploy
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables

3. **Database Configuration**
   - Use MongoDB Atlas for the database
   - Ensure the connection string is properly formatted
   - Add the connection string to Render environment variables

4. **Domain Setup**
   - Configure custom domain if needed
   - Update CORS settings with the new domain
   - Update frontend API endpoint URLs

5. **Post-Deployment Verification**
   - [ ] Test all API endpoints
   - [ ] Verify environment variables
   - [ ] Check database connections
   - [ ] Test AI features
   - [ ] Monitor error logs
   - [ ] Check performance metrics

## Monitoring and Maintenance

### Health Checks
Monitor these endpoints:
- `/health` - Basic health check
- `/api/ai/status` - AI service status
- Database connection status

### Error Monitoring
Add error monitoring service:
```javascript
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Performance Monitoring
Key metrics to monitor:
- Response times
- Error rates
- Database query performance
- AI API response times
- Rate limit hits

### Logging
Configure proper logging:
```javascript
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Scaling Considerations

### 1. Database Scaling
- Enable MongoDB Atlas auto-scaling
- Set up proper indexes
- Implement database caching

### 2. API Scaling
- Implement horizontal scaling
- Set up load balancing
- Configure auto-scaling rules

### 3. AI Service Optimization
- Implement response caching
- Add fallback mechanisms
- Configure retry logic

## Backup and Recovery

### 1. Database Backups
- Enable automated MongoDB Atlas backups
- Set up backup retention policy
- Test restore procedures

### 2. Configuration Backups
- Store environment variables securely
- Document all configuration settings
- Maintain configuration version control

## Security Measures

### 1. API Security
- Enable rate limiting
- Implement request validation
- Set up proper CORS
- Use security headers

### 2. Data Security
- Encrypt sensitive data
- Implement proper access controls
- Regular security audits

### 3. AI Security
- Secure API key management
- Implement usage quotas
- Monitor AI service usage

## Troubleshooting Guide

### Common Issues

1. **Database Connection Issues**
   - Check MongoDB Atlas network access
   - Verify connection string
   - Check database user permissions

2. **AI Service Issues**
   - Verify API key validity
   - Check rate limits
   - Monitor service status

3. **Performance Issues**
   - Check database indexes
   - Monitor memory usage
   - Review API response times

### Emergency Contacts
- Database support: MongoDB Atlas support
- Platform support: Render support
- AI service support: Google Gemini support
