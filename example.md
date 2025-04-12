# Wine Rater 🍷

Wine Rater is a web application for wine enthusiasts to track and rate their wine experiences. This mobile-first web app allows users to upload wine photos, rate wines on a 5-star scale, and add detailed notes about each wine.

## Features

- Add wines to your collection with photos
- Rate wines using a comprehensive multi-category system:
  - Aroma: Evaluate the wine's bouquet and smell
  - Taste: Rate the flavor profile and quality
  - Balance: Assess how well different elements work together
  - Finish: Evaluate the aftertaste and lingering flavors
  - Value: Rate the price-to-quality ratio
- Automatically calculated overall rating based on categories
- Track wine details (name, origin, vintage, type)
- Add personal tasting notes
- Browse your wine collection with an elegant interface
- Edit and delete wine entries

## Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Image Handling**: Multer

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory with the following content:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/winerater
# For production, use your MongoDB Atlas connection string
```

### Running the Application

#### Development Mode (for local use only)

1. Start the backend server:

```bash
# In the backend directory
npm run dev
```

2. Start the frontend development server:

```bash
# In the frontend directory
npm run dev
```

The frontend will be available at http://localhost:5173 and the backend at http://localhost:5001.

#### Using on multiple devices (on the same network)

Use the provided start script to run all services and make the app accessible on your local network:

```bash
# From the root directory
./start.sh
```

This will:
1. Start MongoDB
2. Start the backend server
3. Start the frontend with network access

The app will be available at:
- On your computer: http://localhost:5173
- On your phone or other devices: http://192.168.68.78:5173

To access from your phone:
1. Make sure your phone is connected to the same Wi-Fi network
2. Open your phone's browser
3. Navigate to http://192.168.68.78:5173

#### Production Deployment

For deployment, you can use services like:

- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Render, Railway, or Heroku
- **Database**: MongoDB Atlas

## Directory Structure

```
WineRater/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   └── assets/     # Static assets
│   ├── public/         # Public assets
│   ├── index.html      # Entry HTML file
│   └── package.json    # Frontend dependencies
│
├── backend/            # Node.js backend
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded images storage
│   ├── server.js       # Server entry point
│   └── package.json    # Backend dependencies
│
└── README.md           # Project documentation
```

## License

MIT