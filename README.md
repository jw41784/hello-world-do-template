# Wine Rater 🍷

A serverless wine rating application built with Cloudflare Workers and Durable Objects.

## Features

- **Personal Wine Collection**: Store and manage your wine collection with detailed information
- **Comprehensive Rating System**: Rate wines on aroma, taste, balance, finish, and value
- **Collaborative Tastings**: Create real-time tasting sessions with friends
- **Global Availability**: Low-latency access from anywhere in the world
- **Serverless Architecture**: No backend servers or databases to manage

## Tech Stack

### Backend
- **Cloudflare Workers**: Serverless JavaScript/TypeScript runtime
- **Durable Objects**: Stateful serverless storage and coordination
- **WebSockets**: Real-time collaboration for tasting sessions

### Frontend
- **React**: UI library for building component-based interfaces
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **Vite**: Next-generation frontend build tool
- **React Router**: Client-side routing
- **React Hook Form**: Form validation and handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Cloudflare account

### Installation

1. Clone this repository
2. Install backend dependencies:

```bash
cd wine-rater
npm install
```

3. Install frontend dependencies:

```bash
cd frontend
npm install
```

### Development

Run the backend development server:

```bash
# In the root directory
npm run dev
```

Run the frontend development server:

```bash
# In the frontend directory
npm run dev
```

Access the application at http://localhost:3000 (frontend) which will connect to the backend at http://localhost:8787

### Deployment

Deploy the backend to Cloudflare Workers:

```bash
# In the root directory
npm run deploy
```

Build and deploy the frontend:

```bash
# In the frontend directory
npm run clean-deploy
```

## Project Structure

```
wine-rater/
├── src/                          # Backend code
│   ├── api/                      # API route handlers
│   │   ├── userRoutes.ts         # User API endpoints
│   │   └── sessionRoutes.ts      # Session API endpoints
│   ├── durable_objects/          # Durable Object implementations
│   │   ├── UserObject.ts         # User and wine collection storage
│   │   └── SessionObject.ts      # Tasting session management
│   ├── utils/                    # Utility functions
│   │   ├── cors.ts               # CORS handling
│   │   └── staticPages.ts        # Static HTML generation
│   └── index.ts                  # Main worker entry point
├── frontend/                     # Frontend React application
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── context/              # React context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Page components
│   │   └── utils/                # Utility functions
│   ├── public/                   # Static assets
│   │   ├── cache-clear.html      # Cache-clearing utility
│   │   ├── custom-styles.css     # Custom CSS overrides
│   │   └── language.html         # Language settings
│   └── index.html                # HTML entry point
├── wrangler.json                 # Cloudflare Workers configuration
└── CLAUDE.md                     # Development instructions
```

## API Endpoints

### Authentication

- `POST /api/users/:userId/register` - Register a new user
- `POST /api/users/:userId/auth` - Login and get authentication token
- `DELETE /api/users/:userId/auth` - Logout (revoke token)

### User Management

- `GET /api/users/:userId/user` - Get user profile

### Wine Collection

- `GET /api/users/:userId/wines` - Get user's wine collection 
- `POST /api/users/:userId/wines` - Add a wine to user's collection
- `GET /api/users/:userId/wines/:wineId` - Get a specific wine
- `PUT /api/users/:userId/wines/:wineId` - Update a specific wine
- `DELETE /api/users/:userId/wines/:wineId` - Delete a wine

### Tasting Sessions

- `POST /api/sessions` - Create a new tasting session
- `GET /api/sessions/:sessionId` - Get session details
- `DELETE /api/sessions/:sessionId` - End a session
- `WebSocket /api/sessions/:sessionId/connect` - Join a session (WebSocket)

## Troubleshooting

- If facing wrangler configuration issues, run `npm run cf-typegen` to regenerate TypeScript types
- For WebSocket connection issues, check CORS settings and ensure proper URL configuration
- Authentication issues often relate to token management in UserObject
- If design changes aren't appearing in production:
  1. Visit `/cache-clear.html` to force clear browser cache
  2. Run `npm run clean-deploy` to force rebuild with cache busting

## License

MIT