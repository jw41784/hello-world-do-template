# Wine Rater - Production Deployment Guide

## Deployment Checklist

### Frontend Development
- [ ] Complete frontend pages implementation
  - [ ] Wine list view with sorting and filtering
  - [ ] Wine detail view with ratings display
  - [ ] Add wine form with validation
  - [ ] Edit wine form with validation
  - [ ] Collaborative tasting session interface
  - [ ] User profile page

- [ ] Frontend polish
  - [ ] Add loading states
  - [ ] Implement error boundaries
  - [ ] Add toast notifications
  - [ ] Optimize responsive design
  - [ ] Add animations for better UX
  - [ ] Implement dark mode

- [ ] Frontend testing
  - [ ] Setup testing with Vitest
  - [ ] Write component tests
  - [ ] Write page tests
  - [ ] Write hook tests

### Backend Enhancement
- [x] Organize code structure
  - [x] Separate API routing logic
  - [x] Improve utility functions
  - [x] Clean up main worker file

- [ ] Update Durable Objects
  - [ ] Fix UserObject binding
  - [ ] Fix SessionObject binding
  - [ ] Add migration for SQLite

- [ ] Improve authentication system
  - [ ] Implement proper JWT authentication
  - [ ] Add password hashing with bcrypt via WebAssembly
  - [ ] Add password reset functionality
  - [ ] Add email verification

- [ ] Add image handling
  - [ ] Integrate with Cloudflare Images
  - [ ] Add image upload functionality
  - [ ] Add image resizing and optimization

- [ ] Backend testing
  - [ ] Setup testing framework
  - [ ] Write unit tests for Durable Objects
  - [ ] Write API tests

## Deployment Instructions

### Backend Deployment

1. Configure environment variables in `.env` file:
```
# Production environment values
CF_ACCOUNT_ID=your_cloudflare_account_id  
CF_API_TOKEN=your_cloudflare_api_token
```

2. Update `wrangler.json` with production settings:
```json
{
  "env": {
    "production": {
      "name": "wine-rater-prod",
      "route": "wine-rater.yourdomain.com/*",
      "workers_dev": false
    }
  }
}
```

3. Deploy to production:
```bash
npm run deploy:production
```

### Frontend Deployment

1. Configure environment variables in frontend `.env.production` file:
```
VITE_API_URL=https://wine-rater.yourdomain.com
```

2. Build and deploy:
```bash
cd frontend
npm run clean-deploy
```

3. Configure Cloudflare Pages:
   - Custom domain: wine-rater.pages.dev
   - Build command: npm run clean-deploy
   - Build directory: dist
   - Environment variables properly configured

## Post-Deployment Verification

- [ ] Frontend loads correctly at domain URL
- [ ] API endpoints respond properly
- [ ] WebSocket connections work for tasting sessions
- [ ] Authentication flow works end-to-end
- [ ] Wine collection management functions properly
- [ ] Cache busting works correctly

## Monitoring Setup

- [ ] Cloudflare Workers dashboard for backend performance
- [ ] Cloudflare Pages analytics for frontend performance
- [ ] Set up alerts for errors or unusual traffic patterns

## Rollback Procedure

If issues are detected in production:

1. **Backend**: Run `wrangler rollback` to revert to the previous version
2. **Frontend**: Rollback in the Cloudflare Pages dashboard

## Troubleshooting Guide

### CORS Issues
- Ensure CORS headers are properly configured in both development and production
- Check that the frontend is requesting from the correct API URL

### Authentication Problems
- Check token verification in UserObject.ts
- Verify frontend is sending tokens correctly in request headers
- Check browser console for any token-related errors

### WebSocket Connection Issues
- Ensure WebSocket connections are being upgraded correctly
- Check for any network restrictions that might block WebSocket connections
- Verify correct session ID is being used for connection

### Cache-Related Display Issues
- Direct users to visit `/cache-clear.html`
- Run `npm run cache-buster` to generate a new timestamp
- Manually trigger a cache purge in Cloudflare dashboard

## Command Reference

### Development
```bash
# Start the backend development server
npm run dev

# Start the frontend development server
cd frontend
npm run dev
```

### Production Build
```bash
# Build and deploy the backend
npm run deploy:production

# Build the frontend with cache busting
cd frontend
npm run clean-deploy
```

### Maintenance
```bash
# Regenerate TypeScript types
npm run cf-typegen

# Clean cache and build files
npm run clean

# Run tests (when implemented)
npm test
```