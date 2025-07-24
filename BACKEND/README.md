# Internet Programming Backend

Express.js backend server for the Internet Programming project.

## Features

- 🚀 Express.js REST API
- 🔒 Authentication & Authorization
- 📦 Product Management
- 👤 User Management
- 🛡️ Security Middleware (Helmet, CORS)
- 📝 Request Logging (Morgan)
- 🌍 Environment Configuration

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/featured/list` - Get featured products

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password

### System
- `GET /` - API information
- `GET /health` - Health check

## Quick Start

### 1. Install Dependencies
```bash
cd BACKEND
npm install
```

### 2. Environment Setup
Copy `.env` file and configure as needed:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Start Production Server
```bash
npm start
```

## Project Structure

```
BACKEND/
├── routes/
│   ├── products.js     # Product routes
│   ├── users.js        # User routes
│   └── auth.js         # Authentication routes
├── server.js           # Main server file
├── package.json        # Dependencies and scripts
├── .env                # Environment variables
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 9785 |
| `CORS_ORIGIN` | CORS allowed origin | http://localhost:8081 |
| `JWT_SECRET` | JWT signing secret | your-secret-key |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |

## Production Deployment

The API is deployed at: **http://nindam.sytes.net/**

### Production Endpoints
- Base URL: `http://nindam.sytes.net/api`
- Health Check: `http://nindam.sytes.net/health`
- API Info: `http://nindam.sytes.net/`

## Mock Data

The server uses mock data for demonstration purposes:
- 30 products across 6 categories
- 3 users with different roles
- Authentication with simple password checking

## Security Features

- **Helmet**: Sets various HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Basic validation for API endpoints
- **Error Handling**: Consistent error response format

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Error description"
}
```

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Testing API
Use tools like Postman, Insomnia, or curl to test the API endpoints.

Example:

```bash
# Get all products
curl http://nindam.sytes.net/api/products

# Login user
curl -X POST http://nindam.sytes.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"john.doe@example.com","password":"password123"}'
```

## Completed Features

- [x] JWT authentication with secure tokens
- [x] Password hashing with bcryptjs
- [x] Input validation with express-validator
- [x] Authentication middleware
- [x] Production deployment ready

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] JWT authentication with refresh tokens
- [ ] File upload for product images
- [ ] Email service integration
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization

## License

MIT License - see LICENSE file for details.
