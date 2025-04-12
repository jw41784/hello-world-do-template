/**
 * User API routes handler
 */

import { Env } from '../../worker-configuration';
import { addCorsHeaders } from '../utils/cors';

/**
 * Handle user-related requests
 */
export async function handleUserRequest(request: Request, url: URL, env: Env): Promise<Response> {
  const path = url.pathname;
  const parts = path.split('/').filter(Boolean);
  
  // /api/users
  if (parts.length === 2) {
    const userId = url.searchParams.get('id');
    
    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }
    
    // Create a Durable Object ID for this user
    const id = env.USER_OBJECT.idFromName(userId);
    const stub = env.USER_OBJECT.get(id);
    
    // Forward the request to the user's Durable Object
    const response = await stub.fetch(request);
    return response;
  }
  
  // /api/users/:userId/...
  if (parts.length >= 3) {
    const userId = parts[2];
    
    // Create a Durable Object ID for this user
    const id = env.USER_OBJECT.idFromName(userId);
    const stub = env.USER_OBJECT.get(id);
    
    // Rewrite the URL to the format expected by the Durable Object
    const newUrl = new URL(request.url);
    newUrl.pathname = path.replace(`/api/users/${userId}`, '');
    
    if (newUrl.pathname === '') {
      newUrl.pathname = '/user';
    } else if (newUrl.pathname === '/wines') {
      newUrl.pathname = '/wines';
    }
    
    // Forward the rewritten request to the user's Durable Object
    const newRequest = new Request(newUrl.toString(), request);
    const response = await stub.fetch(newRequest);
    return response;
  }
  
  return new Response('Not Found', { status: 404 });
}