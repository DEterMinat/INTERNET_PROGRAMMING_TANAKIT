const express = require('express');
const { Op } = require('sequelize');
const { User } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/users - Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role, active, limit = 50, offset = 0, search } = req.query;
    
    // Build where conditions
    const whereConditions = {};
    
    // Filter by role
    if (role) {
      whereConditions.role = role;
    }
    
    // Filter by active status
    if (active !== undefined) {
      whereConditions.isActive = active === 'true';
    }
    
    // Search by name, username, or email
    if (search) {
      whereConditions[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const users = await User.findAndCountAll({
      where: whereConditions,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: users.rows,
      pagination: {
        total: users.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < users.count
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// GET /api/users/public - Get public user profiles (for frontend display)
router.get('/public', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const users = await User.findAll({
      where: {
        isActive: true
      },
      attributes: ['id', 'username', 'firstName', 'lastName', 'avatar', 'role'],
      limit: parseInt(limit),
      order: [['created_at', 'ASC']]
    });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching public users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      });
    }
    
    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only view your own profile'
      });
    }
    
    const user = await User.findOne({
      where: {
        id: userId,
        isActive: true
      },
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

// PUT /api/users/:id - Update user (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }
    
    // Don't allow updating password through this endpoint
    const { password, ...updateData } = req.body;
    
    // Check if email is being changed and is already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({
        where: {
          email: updateData.email.toLowerCase(),
          id: { [Op.ne]: userId }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already taken',
          message: 'This email is already registered to another account'
        });
      }
    }
    
    // Check if username is being changed and is already taken
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await User.findOne({
        where: {
          username: updateData.username.toLowerCase(),
          id: { [Op.ne]: userId }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Username already taken',
          message: 'This username is already registered to another account'
        });
      }
    }
    
    // Convert email and username to lowercase if provided
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }
    if (updateData.username) {
      updateData.username = updateData.username.toLowerCase();
    }
    
    const updatedUser = await user.update(updateData);
    
    // Return user without password
    const { password: pwd, ...userResponse } = updatedUser.toJSON();
    
    res.json({
      success: true,
      data: userResponse,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      });
    }
    
    // Prevent admin from deleting themselves
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete own account',
        message: 'Administrators cannot delete their own account'
      });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }
    
    // Soft delete by setting isActive to false
    await user.update({ isActive: false });
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

module.exports = router;
