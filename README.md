# 🏭 Brake Press Scheduler - Cloud Edition

A full-stack web application for scheduling brake press jobs with multi-user authentication, real-time collaboration, and role-based access control.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Vite)                  │
│  HTML/CSS/JS + Firebase Auth + Axios API Client    │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────────────┐
│              Backend (Node.js/Express)              │
│  JWT Validation + Firestore Database Access        │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│           Firebase (Auth + Firestore DB)            │
│  User Management + Cloud Database                   │
└─────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Create a **Firestore Database** (Start in test mode)
5. Generate a service account key:
   - Project Settings → Service Accounts → Generate new private key
   - Save as `backend/serviceAccountKey.json`

### 2. Get Firebase Config

1. In Firebase Console, go to Project Settings
2. Copy the web config (from SDK setup)
3. Update `frontend/.env.local` with your credentials

### 3. Environment Setup

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
CORS_ORIGIN=http://localhost:5173
```

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install
cd ../

# Install frontend dependencies
cd frontend && npm install
cd ../
```

### 5. Run Development Server

```bash
npm run dev
```

This starts both frontend (port 5173) and backend (port 3001) concurrently.

## Features

✅ **Authentication**
- Firebase Auth integration
- Email/password sign up & login
- JWT token validation
- Role-based access control (Admin/Employee)

✅ **Data Management**
- Create/edit/delete machines
- Manage parts library with machine compatibility
- Create orders with line items
- Track order status (Pending → In Progress → Done)

✅ **Multi-User**
- Organization-based data isolation
- Firestore collections per organization
- Real-time data synchronization

✅ **Admin Controls**
- Machine configuration (bend time, handling time, setup time)
- Part compatibility matrix
- Order lifecycle management

## Database Structure (Firestore)

```
organizations/
  {orgId}/
    machines/
      {machineId}: { name, maxLen, setupMin, bendSec, handleSec, notes }
    parts/
      {partId}: { name, bends, notes, combos }
    orders/
      {orderId}: { num, machineId, due, pri, lineItems, status }

users/
  {uid}: { email, name, role, organization, createdAt }
```

## Deployment

### Frontend (Netlify/Vercel)

```bash
npm run frontend:build
```

Deploy the `frontend/dist` folder.

### Backend (Railway/Render/Heroku)

1. Set environment variables on hosting platform
2. Upload `backend/` directory
3. Set start command: `npm start`

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register
- `GET /api/auth/me` - Get current user

### Machines (Admin only)
- `GET /api/machines` - List all
- `POST /api/machines` - Create
- `PUT /api/machines/:id` - Update
- `DELETE /api/machines/:id` - Delete

### Parts (Admin only)
- `GET /api/parts` - List all
- `POST /api/parts` - Create
- `PUT /api/parts/:id` - Update
- `DELETE /api/parts/:id` - Delete

### Orders (Admin only for create/update/delete)
- `GET /api/orders` - List all
- `POST /api/orders` - Create
- `PUT /api/orders/:id/status` - Update status
- `DELETE /api/orders/:id` - Delete

## Next Steps

1. ✅ Complete Firebase setup
2. ✅ Install dependencies
3. ✅ Configure environment variables
4. ✅ Run `npm run dev`
5. ✅ Test authentication flow
6. ✅ Deploy to production

## Support

For issues or questions, open an issue on GitHub.
