# Blood Donation Management System

A full-stack Blood Donation Management System built with React.js frontend, Node.js + Express backend, and CSV files for storage.

## Features

- Donor and acceptor registration & login
- JWT authentication with bcrypt password hashing
- Donor dashboard with guidelines, nearby hospital search, and appointment booking
- Acceptor dashboard with blood inventory search, hospital availability, and map
- CSV storage for users, appointments, and blood inventory
- Geolocation and OpenStreetMap integration
- Responsive UI with Bootstrap and dark mode support

## Project Structure

- `frontend/` — React application
- `backend/` — Express API server
- `backend/csv-data/` — CSV storage files

## Setup

### Backend

1. Open a terminal in `backend`
2. Run `npm install`
3. Copy `.env.example` to `.env` and set `JWT_SECRET`
4. Run `npm run dev`

### Unified Site

- The built frontend is also copied into the root `index.html` and `assets` folder.
- The backend server now serves the unified app from the project root.
- Open `http://localhost:5000` after starting the backend server.

### Netlify Deployment

- Root `index.html` is self-contained and can be deployed as a static site.
- Netlify will serve the frontend, but the backend must be hosted separately on a Node-capable service.
- If the backend is deployed elsewhere, set the backend URL by assigning `window.API_BASE_URL` before the React script runs.
- `netlify.toml` and `_redirects` are included for SPA routing.

### Frontend

1. Open a terminal in `frontend`
2. Run `npm install`
3. Run `npm start`

## CSV Files

The backend automatically creates and seeds the following files in `backend/csv-data/`:

- `donors.csv`
- `acceptors.csv`
- `appointments.csv`
- `blood_inventory.csv`

## Notes

- The frontend defaults to the backend at `http://localhost:5000`
- For public hosting, the backend must be deployed separately and the frontend should point to its URL via `window.API_BASE_URL`.
- Use the login page after registration to access the donor or acceptor dashboard
- Grant location permission for hospital discovery and map features
