/**
 * CORS utility functions for the Wine Rater API
 */

/**
 * Handle CORS preflight requests
 */
export function handleCors(request: Request): Response {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  const headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS preflight request
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  } else {
    // Handle standard OPTIONS request
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, PUT, DELETE, OPTIONS",
      },
    });
  }
}

/**
 * Add CORS headers to a response
 */
export function addCorsHeaders(response: Response): Response {
  // Clone the response so that we can modify headers
  const newResponse = new Response(response.body, response);
  
  // Add CORS headers
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,DELETE,OPTIONS");
  newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  
  return newResponse;
}