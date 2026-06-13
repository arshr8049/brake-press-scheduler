export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  if (err.code === 'FIREBASE_ERROR') {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
}
