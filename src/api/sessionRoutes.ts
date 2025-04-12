/**
 * Session API routes handler
 */

import { Env } from '../../worker-configuration';
import { addCorsHeaders } from '../utils/cors';

/**
 * Handle session-related requests
 */
export async function handleSessionRequest(request: Request, url: URL, env: Env): Promise<Response> {
  const path = url.pathname;
  const parts = path.split('/').filter(Boolean);
  
  // /api/sessions
  if (parts.length === 2) {
    if (request.method === 'POST') {
      // Create a new session with a random ID
      const id = env.SESSION_OBJECT.newUniqueId();
      const stub = env.SESSION_OBJECT.get(id);
      
      // Forward the request to the session's Durable Object
      const newUrl = new URL(request.url);
      newUrl.pathname = '/session';
      const newRequest = new Request(newUrl.toString(), request);
      
      const response = await stub.fetch(newRequest);
      
      // Add the session ID to the response
      const session = await response.json();
      session.uniqueId = id.toString();
      
      return new Response(JSON.stringify(session), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response('Method not allowed', { status: 405 });
  }
  
  // /api/sessions/:sessionId/...
  if (parts.length >= 3) {
    const sessionId = parts[2];
    
    try {
      // Create a Durable Object ID from the session ID string
      const id = env.SESSION_OBJECT.idFromString(sessionId);
      const stub = env.SESSION_OBJECT.get(id);
      
      // Rewrite the URL to the format expected by the Durable Object
      const newUrl = new URL(request.url);
      
      if (parts[3] === 'connect') {
        // WebSocket connection - keep the URL as is
        // Note: WebSockets don't need CORS headers
      } else {
        // Regular HTTP request
        newUrl.pathname = '/session';
      }
      
      // Forward the rewritten request to the session's Durable Object
      const newRequest = new Request(newUrl.toString(), request);
      const response = await stub.fetch(newRequest);
      
      return response;
    } catch (error) {
      return new Response('Invalid session ID', { status: 400 });
    }
  }
  
  return new Response('Not Found', { status: 404 });
}