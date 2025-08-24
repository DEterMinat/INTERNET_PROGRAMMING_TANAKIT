const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const checkQuery = 'SELECT id FROM users WHERE email = ? OR username = ?';
    const existingUser = await executeQuery(checkQuery, [email, username]);

    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const insertQuery = `
      INSERT INTO users (username, email, password, firstName, lastName, role, isActive, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'user', 1, NOW(), NOW())
    `;
    
    const result = await executeQuery(insertQuery, [username, email, hashedPassword, firstName, lastName]);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: result.insertId,
        username,
        email,
        firstName,
        lastName,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user in database
    const query = 'SELECT * FROM users WHERE email = ? AND isActive = 1';
    const users = await executeQuery(query, [email]);
    
    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// GET /api/auth/profile (requires authentication)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT id, username, email, firstName, lastName, role, created_at FROM users WHERE id = ? AND isActive = 1';
    const users = await executeQuery(query, [req.user.id]);
    
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// PUT /api/auth/profile (requires authentication)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, username } = req.body;
    
    if (!firstName || !lastName || !username) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and username are required'
      });
    }

    // Check if username is already taken by another user
    const checkQuery = 'SELECT id FROM users WHERE username = ? AND id != ?';
    const existingUser = await executeQuery(checkQuery, [username, req.user.id]);

    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    // Update user profile
    const updateQuery = `
      UPDATE users 
      SET firstName = ?, lastName = ?, username = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    await executeQuery(updateQuery, [firstName, lastName, username, req.user.id]);

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
}

module.exports = router;
