#!/bin/bash

# Start both backend and frontend development servers

# Create required directories if they don't exist
mkdir -p src/api
mkdir -p src/utils
mkdir -p logs

# Generate TypeScript types if needed
npm run cf-typegen

# Start the backend
echo "Starting Wine Rater backend server..."
(cd $(dirname $0)/.. && npm run dev) &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start the frontend
echo "Starting Wine Rater frontend server..."
(cd $(dirname $0)/../frontend && npm run dev) &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT

# Display URLs
echo ""
echo "=================================="
echo "Wine Rater servers started!"
echo "=================================="
echo "Backend: http://localhost:8787"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=================================="
echo ""

# Keep script running
wait