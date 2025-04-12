#!/bin/bash
# Deployment script for Wine Rater frontend

# Display banner
echo "====================================="
echo "Wine Rater Frontend Deployment v0.1.1"
echo "====================================="
echo "Starting deployment process..."

# Step 1: Clean and build
echo "Step 1: Running clean build process..."
npm run clean-deploy
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Exiting."
  exit 1
fi
echo "✅ Build completed successfully."

# Step 2: Deploy to Cloudflare Pages
echo "Step 2: Deploying to Cloudflare Pages..."
echo "Using directory: dist"

# Check if wrangler is available
if ! command -v wrangler &> /dev/null; then
  echo "⚠️ Wrangler not found, installing..."
  npm install -g wrangler
fi

# Deploy using Wrangler
echo "Deploying with Wrangler..."
wrangler pages publish dist --project-name=wine-rater --commit-dirty=true

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed. Check Cloudflare credentials."
  exit 1
fi

echo "✅ Deployment completed successfully."
echo ""
echo "====================================="
echo "Your site should be available at:"
echo "https://wine-rater.pages.dev"
echo "====================================="
echo ""
echo "To clear browser cache and view your changes, try:"
echo "1. Opening the site in an incognito/private window"
echo "2. Or holding Shift while clicking refresh"
echo "3. Or clearing your browser cache manually"
echo "====================================="