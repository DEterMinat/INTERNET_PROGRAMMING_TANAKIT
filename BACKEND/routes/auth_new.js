const express = require('express');
const router = express.Router();

// Mock auth data
const mockAuthData = {
  users: [
    { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { id: 2, email: 'user@example.com', password: 'user123', role: 'user' }
  ]
};

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const user = mockAuthData.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        token: 'mock-jwt-token'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 1,
      email: 'admin@example.com',
      role: 'admin'
    }
  });
});

module.exports = router;
