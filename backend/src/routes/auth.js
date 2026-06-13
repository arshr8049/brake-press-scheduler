import express from 'express';
import { getAuth, getDb } from '../firebase.js';

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }
  
  try {
    // Create Firebase user
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: name
    });
    
    // Create Firestore user document with employee role
    await getDb().collection('users').doc(userRecord.uid).set({
      email,
      name,
      role: 'employee',
      createdAt: new Date().toISOString(),
      organization: null
    });
    
    // Generate custom token
    const customToken = await getAuth().createCustomToken(userRecord.uid);
    
    res.json({
      uid: userRecord.uid,
      email,
      name,
      role: 'employee',
      token: customToken
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login via email/password (returns custom token)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  try {
    // This is a simplified flow. In production, use Firebase REST API or SDK
    // For now, frontend will use Firebase SDK to get ID token
    res.json({ 
      message: 'Use Firebase SDK on frontend for login. See docs.',
      note: 'Backend validates tokens via authMiddleware'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();
    
    res.json({
      uid: req.user.uid,
      email: req.user.email,
      ...userData
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
