<div align="center" style="margin: 10px 0;">
  <img src="frontend/tourgether/public/Tourgether_logo.png" alt="Tourgether Logo" width="160" height="auto">
  
  # Tourgether
  
  <p><em>A motorcycle route sharing application that allows users to upload, share, and join GPX routes.</em></p>
</div>

## Getting Started

### Prerequisites

**IMPORTANT NOTICE:** You need to be connected to the HTW VPN to use the backend, as the database is hosted by HTW.

### Backend Setup

Instructions for setting up and starting the backend can be found in the [backend README](./backend/README.md).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/tourgether
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` (or the port shown in your terminal).

## Features

- Upload and share GPX motorcycle routes
- Join routes created by other users
- View detailed route information with interactive maps (interactive maps coming in Updated 2.0!)
- Comment on routes
- User authentication and registration

## Technology Stack

- **Frontend:** React, TypeScript, Vite, Leaflet
- **Backend:** Python, Flask, MongoDB
- **Database:** MongoDB (hosted by HTW)
