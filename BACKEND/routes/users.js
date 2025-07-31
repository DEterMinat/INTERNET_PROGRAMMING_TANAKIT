const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Helper function to read JSON files
const readJsonFile = async (filename) => {
  try {
    const filePath = path.join(process.cwd(), 'BACKEND', 'data', filename);
    const data = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(data);
    return json;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return [];
  }
};

// Helper function to get users from JSON file
const getUsersFromJson = async () => {
  try {
    return await readJsonFile('users.json');
  } catch (error) {
    console.error('Failed to fetch users from JSON file:', error);
    return [];
  }
};

// Mock users data
const mockUsers = [
  {
    id: 1,
    username: 'john_doe',
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
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    role: 'customer',
    createdAt: '2024-01-20T14:15:00Z',
    isActive: true
  },
  {
    id: 3,
    username: 'mike_wilson',
    firstName: 'Mike',
    lastName: 'Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'customer',
    createdAt: '2024-02-01T09:15:00Z',
    isActive: true
  },
  {
    id: 4,
    username: 'sarah_johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'customer',
    createdAt: '2024-02-05T16:45:00Z',
    isActive: true
  },
  {
    id: 5,
    username: 'david_brown',
    firstName: 'David',
    lastName: 'Brown',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    role: 'customer',
    createdAt: '2024-02-10T11:20:00Z',
    isActive: true
  },
  {
    id: 6,
    username: 'emma_davis',
    firstName: 'Emma',
    lastName: 'Davis',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'customer',
    createdAt: '2024-02-12T13:30:00Z',
    isActive: true
  },
  {
    id: 7,
    username: 'alex_miller',
    firstName: 'Alex',
    lastName: 'Miller',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
    role: 'customer',
    createdAt: '2024-02-15T08:00:00Z',
    isActive: true
  },
  {
    id: 8,
    username: 'lisa_garcia',
    firstName: 'Lisa',
    lastName: 'Garcia',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    role: 'customer',
    createdAt: '2024-02-18T14:25:00Z',
    isActive: true
  },
  {
    id: 9,
    username: 'ryan_taylor',
    firstName: 'Ryan',
    lastName: 'Taylor',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150',
    role: 'customer',
    createdAt: '2024-02-20T10:10:00Z',
    isActive: true
  },
  {
    id: 10,
    username: 'sofia_martinez',
    firstName: 'Sofia',
    lastName: 'Martinez',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'customer',
    createdAt: '2024-02-22T15:40:00Z',
    isActive: true
  }
];

// GET /api/users/public - Get public users with query params
router.get('/public', async (req, res) => {
  try {
    let count = parseInt(req.query.limit) || 10;
    count = Math.min(count, 50); // Max 50 users
    
    const allUsers = await getUsersFromJson();
    const publicUsers = allUsers
      .filter(user => user.isActive)
      .slice(0, count)
      .map(user => ({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      }));
    
    res.json({
      success: true,
      data: publicUsers,
      count: publicUsers.length,
      total: allUsers.filter(user => user.isActive).length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch public users',
      message: error.message
    });
  }
});

// GET /api/users - Get all users
router.get('/', (req, res) => {
  try {
    const { role, active, limit, offset } = req.query;
    
    let filteredUsers = [...mockUsers];
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    if (active !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === (active === 'true'));
    }
    
    const startIndex = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || filteredUsers.length;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limitNum);
    
    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        total: filteredUsers.length,
        limit: limitNum,
        offset: startIndex,
        hasMore: startIndex + limitNum < filteredUsers.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

module.exports = router;
