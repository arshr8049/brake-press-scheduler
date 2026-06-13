import express from 'express';
import { getDb } from '../firebase.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all machines for user's organization
router.get('/', async (req, res) => {
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) {
      return res.json([]);
    }
    
    const snapshot = await getDb()
      .collection('organizations').doc(orgId)
      .collection('machines')
      .orderBy('createdAt', 'asc')
      .get();
    
    const machines = [];
    snapshot.forEach(doc => {
      machines.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create machine (admin only)
router.post('/', adminOnly, async (req, res) => {
  const { name, maxLen, setupMin, bendSec, handleSec, notes } = req.body;
  
  if (!name || maxLen === undefined || setupMin === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) {
      return res.status(403).json({ error: 'No organization assigned' });
    }
    
    const machineRef = await getDb()
      .collection('organizations').doc(orgId)
      .collection('machines')
      .add({
        name,
        maxLen,
        setupMin,
        bendSec,
        handleSec,
        notes: notes || '',
        createdAt: new Date().toISOString(),
        createdBy: req.user.uid
      });
    
    res.json({
      id: machineRef.id,
      name,
      maxLen,
      setupMin,
      bendSec,
      handleSec,
      notes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update machine (admin only)
router.put('/:id', adminOnly, async (req, res) => {
  const { name, maxLen, setupMin, bendSec, handleSec, notes } = req.body;
  
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) {
      return res.status(403).json({ error: 'No organization assigned' });
    }
    
    await getDb()
      .collection('organizations').doc(orgId)
      .collection('machines')
      .doc(req.params.id)
      .update({
        name,
        maxLen,
        setupMin,
        bendSec,
        handleSec,
        notes: notes || '',
        updatedAt: new Date().toISOString()
      });
    
    res.json({ id: req.params.id, name, maxLen, setupMin, bendSec, handleSec, notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete machine (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) {
      return res.status(403).json({ error: 'No organization assigned' });
    }
    
    await getDb()
      .collection('organizations').doc(orgId)
      .collection('machines')
      .doc(req.params.id)
      .delete();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
