const express = require('express');
const router = express.Router();

// Mock users data
const mockUsers = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john.doe@example.com',
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
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    role: 'customer',
    createdAt: '2024-01-20T14:15:00Z',
    isActive: true
  },
  {
    id: 3,
    username: 'admin_user',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  }
];

// GET /api/users - Get all users
router.get('/', (req, res) => {
  try {
    const { role, active } = req.query;
    
    let filteredUsers = [...mockUsers];
    
    // Filter by role
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    // Filter by active status
    if (active !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === (active === 'true'));
    }
    
    // Remove sensitive information
    const safeUsers = filteredUsers.map(user => {
      const { ...safeUser } = user;
      return safeUser;
    });
    
    res.json({
      success: true,
      data: safeUsers,
      count: safeUsers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }
    
    // Remove sensitive information
    const { ...safeUser } = user;
    
    res.json({
      success: true,
      data: safeUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

// POST /api/users - Create new user
router.post('/', (req, res) => {
  try {
    const { username, email, firstName, lastName, role = 'customer' } = req.body;
    
    // Validation
    if (!username || !email || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Username, email, firstName, and lastName are required'
      });
    }
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'Username or email already taken'
      });
    }
    
    // Create new user
    const newUser = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      username,
      email,
      firstName,
      lastName,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=c471ed&color=fff`,
      role,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    mockUsers.push(newUser);
    
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }
    
    const { username, email, firstName, lastName, role, isActive } = req.body;
    
    // Update user
    const updatedUser = {
      ...mockUsers[userIndex],
      ...(username && { username }),
      ...(email && { email }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(role && { role }),
      ...(isActive !== undefined && { isActive })
    };
    
    mockUsers[userIndex] = updatedUser;
    
    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }
    
    const deletedUser = mockUsers.splice(userIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

module.exports = router;
