import express from 'express';
import { getDb } from '../firebase.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) return res.json([]);
    
    const snapshot = await getDb()
      .collection('organizations').doc(orgId)
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .get();
    
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order (admin only)
router.post('/', adminOnly, async (req, res) => {
  const { num, machineId, due, pri, lineItems } = req.body;
  
  if (!num || !machineId || !due || !lineItems?.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) {
      return res.status(403).json({ error: 'No organization assigned' });
    }
    
    const orderRef = await getDb()
      .collection('organizations').doc(orgId)
      .collection('orders')
      .add({
        num,
        machineId,
        due,
        pri: pri || 'med',
        lineItems,
        status: 'pending',
        completedAt: null,
        createdAt: new Date().toISOString(),
        createdBy: req.user.uid
      });
    
    res.json({ id: orderRef.id, num, machineId, due, pri, lineItems, status: 'pending' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', adminOnly, async (req, res) => {
  const { status } = req.body;
  
  if (!['pending', 'inprog', 'done'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) {
      return res.status(403).json({ error: 'No organization assigned' });
    }
    
    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };
    
    if (status === 'done') {
      updateData.completedAt = new Date().toISOString();
    } else {
      updateData.completedAt = null;
    }
    
    await getDb()
      .collection('organizations').doc(orgId)
      .collection('orders')
      .doc(req.params.id)
      .update(updateData);
    
    res.json({ id: req.params.id, status, ...updateData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const userDoc = await getDb().collection('users').doc(req.user.uid).get();
    const orgId = userDoc.data()?.organization;
    
    if (!orgId) {
      return res.status(403).json({ error: 'No organization assigned' });
    }
    
    await getDb()
      .collection('organizations').doc(orgId)
      .collection('orders')
      .doc(req.params.id)
      .delete();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
