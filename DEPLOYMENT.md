# Deployment Guide

## GitHub Pages Deployment (Frontend Only)

This app is configured for automatic deployment to GitHub Pages when you push to the `main` branch.

### Automatic Deployment
1. Push your code to GitHub
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your app will be available at: `https://Maddin5575SupaBot.github.io/mealPlaner/`

### Manual Deployment
```bash
cd frontend
npm run deploy
```

## Backend Deployment (Optional)

The backend is designed to run separately. For a full-stack deployment:

### Option 1: Railway / Render / Heroku
```bash
cd backend
# Follow platform-specific deployment instructions
```

### Option 2: VPS / Own Server
```bash
cd backend
npm install
npm start
# Set NODE_ENV=production
# Configure reverse proxy (nginx/apache)
```

### Environment Variables
Create `.env` file in backend:
```
PORT=3001
NODE_ENV=production
```

## Development vs Production

### Development
- Frontend: `http://localhost:3000` (proxies to backend)
- Backend: `http://localhost:3001`
- Uses real API calls

### Production (GitHub Pages)
- Frontend: `https://maddin5575.github.io/mealPlaner/`
- Uses mock API data (no backend required)
- For real backend, update `frontend/src/services/api.js` baseURL

## Notes
- GitHub Pages hosts static files only (HTML, CSS, JS)
- Backend needs separate hosting if you want persistent data
- Mock data is provided for demonstration on GitHub Pages
- Update `homepage` in `frontend/package.json` if changing repository name