/**
 * Static HTML page generation utility
 */

/**
 * Generate the home page HTML
 */
export function generateHomePage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wine Rater</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #722F37; /* Wine red */
    }
    .feature {
      margin-bottom: 30px;
    }
    .cta {
      background-color: #722F37;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      display: inline-block;
      text-decoration: none;
      margin-top: 20px;
    }
    .cta:hover {
      background-color: #5E2530;
    }
  </style>
</head>
<body>
  <h1>🍷 Wine Rater</h1>
  <p>Track and rate your wine experiences!</p>
  
  <div class="feature">
    <h2>Store Your Collection</h2>
    <p>Keep track of your favorite wines, their origins, and vintages.</p>
  </div>
  
  <div class="feature">
    <h2>Rate Your Wines</h2>
    <p>Rate wines on aroma, taste, balance, finish, and value.</p>
  </div>
  
  <div class="feature">
    <h2>Collaborative Tastings</h2>
    <p>Host virtual wine tastings with friends in real-time!</p>
  </div>
  
  <a href="/app" class="cta">Get Started</a>
  
  <p><small>Built with Cloudflare Workers and Durable Objects</small></p>
</body>
</html>`;
}

/**
 * Generate API documentation as JSON
 */
export function generateApiDocs(): object {
  return {
    name: 'Wine Rater API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      userWines: '/api/users/:userId/wines',
      sessions: '/api/sessions',
      sessionWebsocket: '/api/sessions/:sessionId/connect'
    }
  };
}