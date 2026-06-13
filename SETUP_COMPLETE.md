# 🚀 Brake Press Scheduler - Complete Cloud Setup Guide

## Phase 1: Firebase Project Setup (5 minutes)

### Step 1.1: Create Firebase Project
```
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name: "brake-press-scheduler"
4. Google Analytics: OFF (skip for now)
5. Click "Create project"
6. Wait for project to initialize
```

### Step 1.2: Enable Authentication
```
1. In Firebase console, go to Authentication (left sidebar)
2. Click "Get started"
3. Email/Password provider → Click it
4. Toggle "Enable" ON
5. Click "Save"
```

### Step 1.3: Create Firestore Database
```
1. Go to Firestore Database (left sidebar)
2. Click "Create database"
3. Start in "Test mode" (for development)
4. Location: "us-central1" (or closest to you)
5. Click "Create"
6. Wait for database to initialize
```

### Step 1.4: Generate Service Account Key
```
1. Go to Project Settings (gear icon, top right)
2. Tab: "Service Accounts"
3. Click "Generate new private key"
4. A JSON file downloads
5. Copy full contents
6. Paste into backend/serviceAccountKey.json
7. Keep this file SECRET (add to .gitignore)
```

### Step 1.5: Get Web Configuration
```
1. Go to Project Settings
2. Tab: "General"
3. Scroll to "Your apps" section
4. Under "Web apps", find your app (or create one with </> icon)
5. Copy the config object (looks like):
   {
     "apiKey": "...",
     "authDomain": "...",
     "projectId": "...",
     "storageBucket": "...",
     "messagingSenderId": "...",
     "appId": "..."
   }
6. Keep these values for next step
```

---

## Phase 2: Configure Environment Files (3 minutes)

### Step 2.1: Backend Configuration
Create `backend/.env`:
```env
PORT=3001
NODE_ENV=development
FIREBASE_PROJECT_ID=brake-press-scheduler
CORS_ORIGIN=http://localhost:5173
```

Copy `backend/serviceAccountKey.json` (from Step 1.4) to the `backend/` directory.

### Step 2.2: Frontend Configuration
Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=brake-press-scheduler.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=brake-press-scheduler
VITE_FIREBASE_STORAGE_BUCKET=brake-press-scheduler.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

Replace the values with those from Step 1.5.

---

## Phase 3: Local Development Setup (5 minutes)

### Step 3.1: Install Dependencies
```bash
# Root
npm install

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Step 3.2: Run Local Development
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Step 3.3: Test Authentication
1. Open http://localhost:5173
2. Sign up with test@example.com / password123
3. You should see the dashboard
4. Check backend console for logs

---

## Phase 4: Production Deployment

### 4A: Deploy Frontend to Netlify (10 minutes)

#### Option A1: Using Netlify CLI
```bash
npm install -g netlify-cli
netlify login
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

#### Option A2: Using GitHub Integration
1. Push code to GitHub
2. Go to https://app.netlify.com/
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub → Select `brake-press-scheduler`
5. Configure build:
   - **Build command**: `npm run frontend:build`
   - **Publish directory**: `frontend/dist`
   - **Base directory**: `/`
6. Click "Deploy site"
7. Wait for build to complete

#### Configure Environment Variables in Netlify
1. Go to Site settings → Build & deploy → Environment
2. Add these variables:
```
VITE_API_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=brake-press-scheduler.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=brake-press-scheduler
VITE_FIREBASE_STORAGE_BUCKET=brake-press-scheduler.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```
3. Trigger redeploy after adding variables

**Your frontend is now live!** 🎉

---

### 4B: Deploy Backend to Railway (15 minutes)

#### Step 1: Prepare GitHub Repository
```bash
git add .
git commit -m "Add complete cloud setup"
git push origin main
```

#### Step 2: Deploy to Railway
1. Go to https://railway.app
2. Click "Create New Project"
3. Select "Deploy from GitHub repo"
4. Authenticate with GitHub
5. Select `brake-press-scheduler` repository
6. Click "Deploy"

#### Step 3: Configure Environment Variables in Railway
1. In Railway, go to your project
2. Go to "Variables" tab
3. Add these variables:
```
PORT=3001
NODE_ENV=production
FIREBASE_PROJECT_ID=brake-press-scheduler
FIREBASE_PRIVATE_KEY=your_private_key_from_serviceAccountKey.json
FIREBASE_CLIENT_EMAIL=your_service_account_email
CORS_ORIGIN=https://your-frontend-url.netlify.app
```

**Note**: For `FIREBASE_PRIVATE_KEY`, copy the `private_key` field from `serviceAccountKey.json` (it has `\n` characters).

#### Step 4: Get Your Backend URL
1. In Railway dashboard, find "Deployments"
2. Click on the deployment
3. Go to "Networking" tab
4. Copy the public URL (looks like `https://brake-press-scheduler-production.up.railway.app`)
5. Add `/api` to get API base: `https://brake-press-scheduler-production.up.railway.app/api`

#### Step 5: Update Frontend API URL
1. Go back to Netlify
2. Site settings → Environment
3. Update `VITE_API_URL` to your Railway URL
4. Trigger redeploy

**Your backend is now live!** 🎉

---

## Phase 5: Firestore Security Rules (Optional but Recommended)

In Firebase Console → Firestore → Rules tab, replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Organization data - based on user's organization
    match /organizations/{orgId} {
      match /{document=**} {
        allow read, write: if 
          request.auth != null &&
          exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organization == orgId;
      }
    }
  }
}
```

Publish these rules.

---

## Phase 6: Final Testing

### Test Checklist
- [ ] Frontend loads at Netlify URL
- [ ] Can sign up with new account
- [ ] Can log in
- [ ] Dashboard shows correctly
- [ ] Backend API responds (check network tab)
- [ ] No CORS errors in browser console
- [ ] No 401/403 errors

### Test Sign Up Flow
1. Go to your Netlify URL
2. Sign up with `test@yourcompany.com` / `TestPassword123!`
3. Verify email is listed in Firebase Auth console

### Create Test Admin User
In Firebase Console:
1. Go to Authentication
2. Click the user you just created
3. In "Custom claims", set:
```json
{
  "role": "admin",
  "organization": "org_123"
}
```

---

## Phase 7: Make Admin User & Set Organization

```bash
# In backend, create a script (backend/scripts/setup-admin.js):

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'brake-press-scheduler'
});

const db = admin.firestore();
const auth = admin.auth();

async function setupAdmin(email) {
  try {
    const user = await auth.getUserByEmail(email);
    
    // Set custom claims
    await auth.setCustomUserClaims(user.uid, { role: 'admin' });
    
    // Create/update user doc
    await db.collection('users').doc(user.uid).set({
      email,
      name: email.split('@')[0],
      role: 'admin',
      organization: 'default-org',
      createdAt: new Date().toISOString()
    }, { merge: true });
    
    // Create organization
    await db.collection('organizations').doc('default-org').set({
      name: 'Default Organization',
      createdAt: new Date().toISOString()
    }, { merge: true });
    
    console.log(`✅ Admin setup complete for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupAdmin(process.argv[2] || 'admin@example.com');
```

Run:
```bash
cd backend
node scripts/setup-admin.js your-email@company.com
```

---

## 🎯 Summary - You Now Have

✅ **Firebase Project** - Auth + Firestore database  
✅ **Frontend** - Deployed on Netlify, live URL  
✅ **Backend** - Deployed on Railway, live API  
✅ **Authentication** - Email/password signup & login  
✅ **Database** - Real-time Firestore storage  
✅ **Admin Controls** - Role-based access management  
✅ **Security** - JWT validation, CORS, Firestore rules  

---

## 📱 Usage

**Admin URL**: https://your-app.netlify.app  
**Sign up** with admin email  
**Run setup script** to make yourself admin  
**Create machines** → **Add parts** → **Schedule orders**  

---

## 🆘 Troubleshooting

### "CORS error in browser"
→ Check `VITE_API_URL` matches your Railway backend URL

### "401 Unauthorized"
→ Service account key not set in Railway variables

### "Can't create machines (403)"
→ User not set as admin. Run setup script again.

### "Firestore permission denied"
→ Check Firebase rules allow your user's organization

### "Frontend not updating after redeploy"
→ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## 🚀 Next Steps

1. ✅ Complete Phase 1-2 (Firebase + Environment)
2. ✅ Complete Phase 3 (Local testing)
3. ✅ Complete Phase 4 (Netlify + Railway deployment)
4. ✅ Complete Phase 5-7 (Security + Admin setup)
5. 🎉 You're live!

Need help? Check the error logs:
- **Netlify**: Deployments tab → build log
- **Railway**: Deployments → Live logs
- **Firebase**: Console → Error reporting
