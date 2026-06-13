# Deployment Guide

## Frontend Deployment (Netlify)

### Step 1: Build the frontend
```bash
cd frontend
npm run build
```

### Step 2: Deploy to Netlify

Option A: Using Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=frontend/dist
```

Option B: Using GitHub
1. Push code to GitHub
2. Go to [Netlify](https://app.netlify.com/)
3. New site from Git → Select your repo
4. Build command: `npm run frontend:build`
5. Publish directory: `frontend/dist`
6. Add environment variables in Netlify settings

### Step 3: Configure environment variables
In Netlify → Site settings → Build & deploy → Environment:
```
VITE_API_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
...
```

---

## Backend Deployment (Railway)

### Step 1: Prepare for deployment
1. Push code to GitHub
2. Go to [Railway](https://railway.app)
3. New project → Deploy from GitHub repo

### Step 2: Set environment variables
In Railway → Variables:
```
NODE_ENV=production
PORT=3001
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-key (copy from service account)
FIREBASE_CLIENT_EMAIL=your-email
CORS_ORIGIN=https://your-frontend-url.netlify.app
```

### Step 3: Deploy
Railway will auto-deploy when you push to GitHub.

---

## Alternative: Firebase Hosting + Cloud Functions

### Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init
```

### Deploy frontend to Firebase Hosting
```bash
npm run frontend:build
firebase deploy --only hosting
```

### Deploy backend as Cloud Function
1. Move `backend/src` to `functions/`
2. Update `firebase.json` to deploy functions
3. `firebase deploy`

---

## Production Checklist

- [ ] Update `ADMIN_PASSWORD` in code
- [ ] Configure Firestore security rules
- [ ] Set up CORS properly
- [ ] Enable HTTPS everywhere
- [ ] Set up logging and monitoring
- [ ] Configure database backups
- [ ] Test authentication flow
- [ ] Load test the backend
- [ ] Set up SSL certificates
- [ ] Configure custom domain
