# 🌍 Deployment URLs & Status

## Frontend URLs (Choose One)

| Platform | Command | Status | URL |
|----------|---------|--------|-----|
| **Netlify** | `netlify deploy --prod --dir frontend/dist` | ⏳ Ready | `brake-press-scheduler.netlify.app` |
| **Vercel** | `vercel --prod` | ⏳ Ready | `brake-press-scheduler.vercel.app` |
| **Firebase** | `firebase deploy --only hosting` | ⏳ Ready | `brake-press-cloud-prod.web.app` |

## Backend URLs (Choose One)

| Platform | Setup | Status | URL |
|----------|-------|--------|-----|
| **Railway** | Push to GitHub + connect | ⏳ Ready | `your-backend.railway.app` |
| **Render** | Create service + add repo | ⏳ Ready | `your-backend.onrender.com` |
| **Firebase Functions** | `firebase deploy --only functions` | ⏳ Ready | `us-central1-brake-press-cloud-prod.cloudfunctions.net` |

## Quick Start - 3 Steps

### Step 1: Build Frontend
```bash
cd frontend && npm install && npm run build && cd ..
```

### Step 2: Deploy Frontend
```bash
# Using Netlify CLI (easiest)
npm install -g netlify-cli
netlify deploy --prod --dir frontend/dist
```
Copy your live frontend URL.

### Step 3: Deploy Backend
```bash
# Using Railway (easiest)
# Go to https://railway.app
# Connect GitHub repo
# Add environment variables
# Click deploy
```
Copy your live backend URL.

## Update Config

After getting your URLs:

**In Netlify settings, update:**
```
VITE_API_URL=YOUR_BACKEND_URL
```

**In Railway settings, update:**
```
CORS_ORIGIN=YOUR_FRONTEND_URL
```

Redeploy frontend.

---

✅ **YOU'RE LIVE!**
