const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { authenticateToken, validateInput } = require('../middleware/auth');
const router = express.Router();

// Mock users database (in real app, use proper database)
let mockUsers = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8yoKXgS8p1qE.2QzVLJGdJxVDCNO1K', // password123
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'customer',
    createdAt: '2024-01-15T10:30:00Z',
    isActive: true
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8yoKXgS8p1qE.2QzVLJGdJxVDCNO1K', // password456
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    role: 'customer',
    createdAt: '2024-01-20T14:15:00Z',
    isActive: true
  },
  {
    id: 3,
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8yoKXgS8p1qE.2QzVLJGdJxVDCNO1K', // admin123
    firstName: 'Admin',
    lastName: 'User',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  }
];

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Helper function to remove password from user object
const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const registerValidation = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required')
];

// POST /api/auth/login - User login
router.post('/login', validateInput(loginValidation), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = mockUsers.find(u => u.email === email && u.isActive);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'User not found or inactive'
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Incorrect password'
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
        expiresIn: process.env.JWT_EXPIRES_IN
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

// POST /api/auth/register - User registration
router.post('/register', validateInput(registerValidation), async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'Username or email already taken'
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=c471ed&color=fff`,
      role: 'customer',
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    mockUsers.push(newUser);
    
    // Generate token
    const token = generateToken(newUser);
    
    res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(newUser),
        token,
        expiresIn: process.env.JWT_EXPIRES_IN
      },
      message: 'Registration successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', (req, res) => {
  try {
    // In a real app with database, you might want to blacklist the token
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: error.message
    });
  }
});

// GET /api/auth/me - Get current user info (protected route)
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = mockUsers.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User does not exist'
      });
    }
    
    res.json({
      success: true,
      data: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user info',
      message: error.message
    });
  }
});

// POST /api/auth/forgot-password - Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], validateInput([
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
]), (req, res) => {
  try {
    const { email } = req.body;
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No user found with this email'
      });
    }
    
    // In real app, send email with reset link
    // For demo, we'll just return success
    res.json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process forgot password request',
      message: error.message
    });
  }
});

// PUT /api/auth/change-password - Change password (protected route)
router.put('/change-password', authenticateToken, validateInput([
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
]), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User does not exist'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, mockUsers[userIndex].password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    mockUsers[userIndex].password = hashedNewPassword;
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      message: error.message
    });
  }
});

module.exports = router;
