# JWT Authentication Migration Guide

This document describes the changes made to migrate from cookie-based authentication to JWT-based authentication.

## Changes Made

### 1. New Dependencies
- Added `jsonwebtoken` package for JWT token generation and verification

### 2. New Files Created
- **`utlis/jwtHelpers.js`**: JWT utility functions for token generation and verification
- **`test-jwt-auth.js`**: Test script to verify JWT authentication

### 3. Modified Files

#### `Middleware/auth.js`
- Changed from reading cookies to reading Authorization header
- Now expects tokens in format: `Authorization: Bearer <token>`
- Updated error messages for JWT-specific errors (expired, invalid tokens)

#### `Controller/StudentAuthController.js`
- Login now returns a JWT token instead of setting a cookie
- Response includes:
  - `token`: The JWT token
  - `expiresIn`: Token expiration time (24h)
- Logout is now handled client-side (remove token from storage)

#### `app.js`
- Removed `cookie-parser` dependency
- Updated CORS configuration to allow Authorization header

## API Changes

### Login Endpoint
**POST** `/api/students/login`

Request:
```json
{
  "studentID": "your-student-id",
  "password": "your-password"
}
```

Response:
```json
{
  "message": "Welcome John Doe",
  "studentID": "your-student-id",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### Protected Routes
All protected routes now require the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Example:
```javascript
fetch('http://localhost:1000/api/students/profile', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})
```

## Client-Side Implementation

### Storing the Token
After successful login, store the token securely:
```javascript
// Example using localStorage (consider security implications)
localStorage.setItem('authToken', response.data.token);
```

### Using the Token
Include the token in all requests to protected endpoints:
```javascript
const token = localStorage.getItem('authToken');

fetch('/api/students/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Logout
Simply remove the token from client storage:
```javascript
localStorage.removeItem('authToken');
```

## Environment Variables

Add to your `.env` file:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

## Security Considerations

1. **Token Storage**: 
   - Consider using httpOnly cookies for token storage if XSS is a concern
   - Or use sessionStorage instead of localStorage for better security

2. **Token Expiration**: 
   - Tokens expire after 24 hours by default
   - Implement token refresh mechanism for better UX

3. **Secret Key**: 
   - Always use a strong, random JWT secret in production
   - Never commit the secret to version control

## Testing

Run the test script to verify JWT authentication:
```bash
# Install test dependency
bun add axios

# Run tests
node test-jwt-auth.js
```

## Migration Checklist

- [x] Install jsonwebtoken package
- [x] Create JWT helper functions
- [x] Update auth middleware
- [x] Update login controller
- [x] Remove cookie-parser
- [x] Update CORS settings
- [ ] Update frontend to use JWT tokens
- [ ] Test all protected endpoints
- [ ] Update API documentation