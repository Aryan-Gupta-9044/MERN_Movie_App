# Deployment Guide

## Quick Start

### 1. Install Git
- Download from: https://git-scm.com/download/win
- Install and restart your terminal

### 2. Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Name: `MERN_Movie_App`
4. Keep it Public
5. Don't initialize with README (we have one)

### 3. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: MERN Movie App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/MERN_Movie_App.git
git push -u origin main
```

## Deployment

### Frontend (Vercel)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Settings:
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: Your backend URL (get this after deploying backend)

### Backend (Railway)
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select your repository
5. Settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `MONGODB_DB`: `sample_mflix`
   - `PORT`: `5001`

### After Deployment
1. Get your Railway backend URL
2. Update Vercel environment variable `VITE_API_URL` with your Railway URL
3. Redeploy Vercel

## Alternative Platforms

### Frontend Options
- **Netlify**: https://netlify.com
- **GitHub Pages**: For static sites

### Backend Options
- **Render**: https://render.com
- **Heroku**: https://heroku.com (paid)
- **DigitalOcean App Platform**: https://cloud.digitalocean.com

## Environment Variables

### Frontend (.env in client folder)
```
VITE_API_URL=https://your-backend-url.railway.app
```

### Backend (.env in server folder)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=sample_mflix
PORT=5001
```

## Troubleshooting

### Common Issues
1. **CORS errors**: Make sure your backend has CORS enabled
2. **API not found**: Check your VITE_API_URL environment variable
3. **Database connection**: Verify your MongoDB URI is correct
4. **Build failures**: Check that all dependencies are in package.json

### Testing Locally
```bash
# Backend
cd server
npm start

# Frontend (new terminal)
cd client
npm run dev
```
