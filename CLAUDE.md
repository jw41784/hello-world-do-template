# CLAUDE.md - Claude Code Helper Configuration

## Development Commands

When developing Wine Rater, use these commands:

### Backend (Durable Objects)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy to Cloudflare Workers
npm run deploy

# Generate TypeScript types
npm run cf-typegen
```

### Frontend (React)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production with cache busting
npm run clean-deploy

# Force rebuild with cache busting
npm run force-build

# Clear cache and rebuild
npm run clear-cache && npm run cache-buster && npm run build
```

## Current Project Status (Updated April 2025)

### Recent Refactoring Efforts
- ✅ Backend code has been refactored for better organization
- ✅ Frontend components have been redesigned with wine theme
- ⚠️ Frontend deployment issues persist (old version still showing)

### Known Issues
- The live site at wine-rater.pages.dev still shows "Vinolini" in the title
- Cache clearing utilities do not resolve the frontend deployment issue
- Local frontend development server works but has connectivity issues

## Production Deployment

The frontend is deployed to Cloudflare Pages at https://wine-rater.pages.dev

To deploy a new version:
```bash
cd frontend
./deploy.sh
```

## Updated Project Structure

The application structure has been refactored as follows:

- `src/` - Backend code using Cloudflare Workers and Durable Objects
  - `api/` - API route handlers for different endpoints
    - `userRoutes.ts` - User-related API endpoints
    - `sessionRoutes.ts` - Session-related API endpoints
  - `durable_objects/` - Durable Object implementations
    - `UserObject.ts` - User and wine collection storage
    - `SessionObject.ts` - Tasting session management
  - `utils/` - Utility functions
    - `cors.ts` - CORS handling utilities
    - `staticPages.ts` - Static HTML generation
  - `index.ts` - Main worker entrypoint (simplified)

- `frontend/` - React frontend application
  - `src/` - Frontend source code
    - `components/` - Reusable UI components
    - `context/` - React context providers
    - `hooks/` - Custom React hooks
    - `pages/` - Page components
    - `utils/` - Utility functions
  - `public/` - Static assets
    - `cache-clear.html` - Utility to clear browser cache
    - `language.html` - Language settings page
    - `custom-styles.css` - Direct CSS overrides
  - `index.html` - HTML entry point
  - `cache-buster.js` - Script for cache busting
  - `deploy.sh` - Deployment script

## Development Notes

- For Durable Objects migrations, always update wrangler.json and run `npm run cf-typegen`
- When modifying the API, ensure frontend API calls are updated accordingly
- Remember that Durable Objects provide strong consistency but have usage limits
- When making styling changes, always update the custom-styles.css file
- Use the cache-busting system for CSS and font changes

## Troubleshooting

- If facing wrangler configuration issues, manually update worker-configuration.d.ts
- For WebSocket connection issues, check CORS and ensure proper URL configuration
- Authentication issues often relate to token management in UserObject
- If design changes aren't appearing in production:
  1. Visit `/cache-clear.html` to force clear browser cache
  2. Visit `/language.html` to ensure language is set to English
  3. Run `npm run clean-deploy` to force rebuild with cache busting
- For frontend deployment issues:
  1. Check Cloudflare Pages deployment logs
  2. Verify deployment credentials and settings
  3. Consider creating a new Pages project to avoid conflicts

## Design System

The application uses:
- **Fonts**: Cormorant Garamond (headings) and Outfit (body)
- **Colors**: Wine-themed palette with burgundy primary colors
- **Components**: Custom TailwindCSS components defined in index.css
- **Animations**: Subtle hover effects on buttons and cards

## Next Steps

1. Troubleshoot frontend deployment issues
2. Verify backend API functionality
3. Set up proper local development environment
4. Complete the implementation of all wine management pages

## Useful Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Durable Objects Documentation](https://developers.cloudflare.com/durable-objects/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)