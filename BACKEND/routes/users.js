const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');
const bcrypt = require('bcrypt');

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const { 
      role, 
      isActive, 
      search, 
      limit = 50, 
      offset = 0, 
      sortBy = 'created_at', 
      sortOrder = 'DESC' 
    } = req.query;

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (role) {
      whereClause += ' AND role = ?';
      queryParams.push(role);
    }
    if (isActive !== undefined) {
      whereClause += ' AND isActive = ?';
      queryParams.push(isActive === 'true' ? 1 : 0);
    }
    if (search) {
      whereClause += ' AND (username LIKE ? OR email LIKE ? OR firstName LIKE ? OR lastName LIKE ?)';
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Validate sort parameters
    const validSortColumns = ['id', 'username', 'email', 'firstName', 'lastName', 'role', 'created_at', 'updated_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const orderByColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const orderByDirection = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Get users (exclude password field)
    const query = `
      SELECT id, username, email, firstName, lastName, role, isActive, created_at, updated_at
      FROM users 
      ${whereClause}
      ORDER BY ${orderByColumn} ${orderByDirection}
      LIMIT ? OFFSET ?
    `;
    
    const users = await executeQuery(query, [...queryParams, parseInt(limit), parseInt(offset)]);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = await executeQuery(countQuery, queryParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: users || [],
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      filters: { role, isActive, search, sortBy, sortOrder }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    const query = `
      SELECT id, username, email, firstName, lastName, role, isActive, created_at, updated_at
      FROM users 
      WHERE id = ?
    `;
    
    const users = await executeQuery(query, [parseInt(id)]);

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
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// POST /api/users - Create new user (admin only)
router.post('/', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role = 'user' } = req.body;
    
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
      VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `;
    
    const result = await executeQuery(insertQuery, [username, email, hashedPassword, firstName, lastName, role]);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: result.insertId,
        username,
        email,
        firstName,
        lastName,
        role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, firstName, lastName, role, isActive } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    // Check if user exists
    const checkQuery = 'SELECT id FROM users WHERE id = ?';
    const existingUser = await executeQuery(checkQuery, [parseInt(id)]);

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username/email is already taken by another user
    if (username || email) {
      const duplicateQuery = 'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?';
      const duplicateUser = await executeQuery(duplicateQuery, [username || '', email || '', parseInt(id)]);

      if (duplicateUser && duplicateUser.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Username or email is already taken'
        });
      }
    }

    // Build update query
    let updateFields = [];
    let updateParams = [];

    if (username) {
      updateFields.push('username = ?');
      updateParams.push(username);
    }
    if (email) {
      updateFields.push('email = ?');
      updateParams.push(email);
    }
    if (firstName) {
      updateFields.push('firstName = ?');
      updateParams.push(firstName);
    }
    if (lastName) {
      updateFields.push('lastName = ?');
      updateParams.push(lastName);
    }
    if (role) {
      updateFields.push('role = ?');
      updateParams.push(role);
    }
    if (isActive !== undefined) {
      updateFields.push('isActive = ?');
      updateParams.push(isActive ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push('updated_at = NOW()');
    updateParams.push(parseInt(id));

    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await executeQuery(updateQuery, updateParams);

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    // Check if user exists
    const checkQuery = 'SELECT id FROM users WHERE id = ?';
    const existingUser = await executeQuery(checkQuery, [parseInt(id)]);

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - set isActive to 0
    const deleteQuery = 'UPDATE users SET isActive = 0, updated_at = NOW() WHERE id = ?';
    await executeQuery(deleteQuery, [parseInt(id)]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// GET /api/users/statistics - Get user statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const queries = {
      total: 'SELECT COUNT(*) as count FROM users WHERE isActive = 1',
      admins: 'SELECT COUNT(*) as count FROM users WHERE role = "admin" AND isActive = 1',
      users: 'SELECT COUNT(*) as count FROM users WHERE role = "user" AND isActive = 1',
      inactive: 'SELECT COUNT(*) as count FROM users WHERE isActive = 0',
      recentUsers: 'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND isActive = 1'
    };

    const results = await Promise.all([
      executeQuery(queries.total),
      executeQuery(queries.admins),
      executeQuery(queries.users),
      executeQuery(queries.inactive),
      executeQuery(queries.recentUsers)
    ]);

    const statistics = {
      totalUsers: results[0][0].count,
      admins: results[1][0].count,
      users: results[2][0].count,
      inactiveUsers: results[3][0].count,
      recentUsers: results[4][0].count
    };

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
});

module.exports = router;
