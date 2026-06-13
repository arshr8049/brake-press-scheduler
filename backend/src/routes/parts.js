import express from 'express';
import { getDb } from '../firebase.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all parts
router.get('/', async (req, res) => {
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) return res.json([]);
    
    const snapshot = await getDb()
      .collection('organizations').doc(orgId)
      .collection('parts')
      .orderBy('createdAt', 'asc')
      .get();
    
    const parts = [];
    snapshot.forEach(doc => {
      parts.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(parts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create part (admin only)
router.post('/', adminOnly, async (req, res) => {
  const { name, bends, notes, combos } = req.body;
  
  if (!name || !bends) {
    return res.status(400).json({ error: 'Name and bends required' });
  }
  
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) {
      return res.status(403).json({ error: 'No organization assigned' });
    }
    
    const partRef = await getDb()
      .collection('organizations').doc(orgId)
      .collection('parts')
      .add({
        name,
        bends,
        notes: notes || '',
        combos: combos || {},
        createdAt: new Date().toISOString(),
        createdBy: req.user.uid
      });
    
    res.json({ id: partRef.id, name, bends, notes, combos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update part (admin only)
router.put('/:id', adminOnly, async (req, res) => {
  const { name, bends, notes, combos } = req.body;
  
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) {
      return res.status(403).json({ error: 'No organization assigned' });
    }
    
    await getDb()
      .collection('organizations').doc(orgId)
      .collection('parts')
      .doc(req.params.id)
      .update({
        name,
        bends,
        notes: notes || '',
        combos: combos || {},
        updatedAt: new Date().toISOString()
      });
    
    res.json({ id: req.params.id, name, bends, notes, combos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete part (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) {
      return res.status(403).json({ error: 'No organization assigned' });
    }
    
    await getDb()
      .collection('organizations').doc(orgId)
      .collection('parts')
      .doc(req.params.id)
      .delete();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
