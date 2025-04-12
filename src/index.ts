import { handleUserRequest } from './api/userRoutes';
import { handleSessionRequest } from './api/sessionRoutes';
import { handleCors, addCorsHeaders } from './utils/cors';
import { generateHomePage, generateApiDocs } from './utils/staticPages';

/**
 * Wine Rater - A Durable Objects Application
 * 
 * This application allows users to:
 * - Store and manage their wine collection
 * - Rate wines based on multiple criteria
 * - Participate in collaborative tasting sessions
 */

// Re-export the Durable Objects
export { UserObject } from './durable_objects/UserObject';
export { SessionObject } from './durable_objects/SessionObject';

export default {
  /**
   * Main fetch handler for the Wine Rater application
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return handleCors(request);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Serve static files (if we added static assets)
    if (path.startsWith('/assets/')) {
      // This would be handled by Cloudflare Pages or Workers Sites
      return addCorsHeaders(new Response('Static asset would be served here', { status: 200 }));
    }

    // User routes
    if (path.startsWith('/api/users')) {
      const response = await handleUserRequest(request, url, env);
      return addCorsHeaders(response);
    }

    // Session routes
    if (path.startsWith('/api/sessions')) {
      const response = await handleSessionRequest(request, url, env);
      
      // Only add CORS headers for HTTP requests, not WebSocket upgrades
      if (response.headers.get('Upgrade') !== 'websocket') {
        return addCorsHeaders(response);
      }
      return response;
    }

    // Home page or SPA
    if (path === '/' || path === '/index.html') {
      const html = generateHomePage();
      
      return addCorsHeaders(new Response(html, {
        headers: {
          'Content-Type': 'text/html'
        }
      }));
    }

    // API documentation
    if (path === '/api' || path === '/api/docs') {
      const apiInfo = generateApiDocs();
      
      return addCorsHeaders(new Response(JSON.stringify(apiInfo, null, 2), {
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    }

    // If no routes match, return 404
    return addCorsHeaders(new Response('Not Found', { status: 404 }));
  },
} satisfies ExportedHandler<Env>;