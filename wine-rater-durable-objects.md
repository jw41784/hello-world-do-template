# Wine Rater with Durable Objects Implementation Guide

## Migration Path from Traditional Stack to Durable Objects

This guide outlines how to implement the Wine Rater application using Cloudflare Durable Objects instead of the traditional MERN stack described in example.md.

### Step 1: Project Setup

1. **Create a new project** (don't modify the hello-world-do-template directly):
   ```bash
   npm create cloudflare@latest wine-rater-do -- --template=cloudflare/templates/hello-world-do-template
   cd wine-rater-do
   npm install
   ```

2. **Structure your project**:
   ```
   wine-rater-do/
   ├── src/
   │   ├── durable_objects/     # Durable Objects implementation
   │   │   ├── UserObject.ts    # User data and wine collection
   │   │   ├── WineObject.ts    # Wine ratings aggregation
   │   │   └── SessionObject.ts # Collaborative tasting sessions
   │   ├── components/          # React components (if using Workers Sites)
   │   ├── assets/              # Static assets
   │   └── index.ts             # Main worker entry point
   └── public/                  # Static files for frontend
   ```

### Step 2: Implement Durable Objects

1. **User Durable Object** (src/durable_objects/UserObject.ts):
   - Store user profiles and individual wine collections
   - Implement methods for CRUD operations on wine entries
   - Manage user preferences and settings

2. **Wine Durable Object** (src/durable_objects/WineObject.ts):
   - Aggregate ratings across users for a specific wine
   - Calculate and maintain statistics (avg score, popularity)
   - Track metadata like region, type, vintage across entries

3. **Session Durable Object** (src/durable_objects/SessionObject.ts):
   - Enable real-time collaborative wine tastings
   - Manage WebSocket connections for participants
   - Synchronize ratings and comments in real-time

### Step 3: Modify Main Worker (src/index.ts)

1. Replace the sample Durable Object with your implementations
2. Implement API routes for wine and user operations
3. Add WebSocket handling for collaborative features
4. Serve the frontend static assets

### Step 4: Implement Frontend

1. Either use Workers Sites to serve a React frontend directly or:
2. Create a separate frontend project deployed to Cloudflare Pages
3. Connect the frontend to your Durable Objects Worker API

### Step 5: Wrangler Configuration (wrangler.json)

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "wine-rater-do",
  "main": "src/index.ts",
  "compatibility_date": "2025-04-01",
  "migrations": [
    {
      "new_sqlite_classes": ["UserObject", "WineObject", "SessionObject"],
      "tag": "v1"
    }
  ],
  "durable_objects": {
    "bindings": [
      {
        "name": "USER_OBJECT",
        "class_name": "UserObject"
      },
      {
        "name": "WINE_OBJECT", 
        "class_name": "WineObject"
      },
      {
        "name": "SESSION_OBJECT",
        "class_name": "SessionObject"
      }
    ]
  }
}
```

## Deployment Instructions

1. **Local Development**:
   ```bash
   npm run dev
   ```
   Access at http://localhost:8787

2. **Production Deployment**:
   ```bash
   npm run deploy
   ```

3. **Custom Domain Setup** (optional):
   1. Add your domain in Cloudflare Dashboard
   2. Create a Worker Route pointing to your deployed worker

## Migrating Existing Wine Rater Files

**Do not move existing files directly into this project.** Instead:

1. **Reference your existing frontend code** for component and UI design
2. **Reimplement the logic** for the Durable Objects architecture
3. **Adapt API endpoints** to match your current frontend expectations
4. **Create a data migration script** if needed to transfer existing MongoDB data

## Key Advantages

1. **Simplified Infrastructure**: Single deployment for both frontend and backend
2. **Global Low-latency**: Durable Objects run close to users worldwide
3. **No Database Management**: No separate MongoDB to maintain
4. **Serverless Scaling**: Automatic scaling without managing servers
5. **Cost Efficiency**: Pay only for what you use with no idle resources

## Next Steps

1. Implement authentication (consider using Cloudflare Access or a third-party auth provider)
2. Set up Cloudflare Images for wine photo storage
3. Implement offline support with service workers
4. Create analytics tracking using Durable Objects counters