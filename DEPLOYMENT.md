# Deployment Guide

This project contains a unified frontend `index.html` and a Node.js backend using CSV storage.

## 1. Frontend Deployment (Netlify)

The frontend is a self-contained single-page app in `index.html`.

Steps:
1. Push the repository to GitHub or export the project root.
2. Create a new site in Netlify.
3. Set the publish directory to the project root.
4. Add the included `_redirects` and `netlify.toml` files to support SPA routing.
5. Deploy.

### Backend URL

The frontend uses `window.API_BASE_URL` to locate the backend.

If your backend URL is `https://mybackend.onrender.com`, edit `index.html` before deploy and set:

```html
<script>
window.API_BASE_URL = 'https://mybackend.onrender.com';
</script>
```

If you deploy the backend to the same origin as the frontend, you can leave it as the default.

## 2. Backend Deployment (Render or other Node host)

The backend is in the `backend/` folder.

### Render

1. Create a new Web Service on Render.
2. Point it to the `backend/` repository folder.
3. Set the environment to Node.
4. Use `npm install` as the build command.
5. Use `npm run dev` as the start command.
6. Set the `JWT_SECRET` environment variable.

### Important: CSV persistence

- The backend stores data in CSV files inside `backend/csv-data/`.
- Many cloud hosts use ephemeral containers, so these files may not persist across deployments or restarts.
- For reliable production usage, migrate to a database or use a host with persistent disk support.

## 3. Local Run

### Backend

```bash
cd backend
npm install
npm run dev
```

Then open `http://localhost:5000`.

### Frontend

The root `index.html` is already self-contained and can be opened directly if the backend is available.
