# Birdy Security Documentation

## Password Security
- Passwords hashed with **bcrypt** (10 salt rounds) — computationally expensive, resistant to brute-force
- Password complexity requirements: min 8 chars, uppercase, lowercase, digit, special character
- Plain passwords are never stored or logged

## Authentication
- **JWT (JSON Web Tokens)** with `jsonwebtoken`
- Secret from `process.env.JWT_SECRET` (falls back to dev secret — always set in production)
- Tokens expire after 7 days
- Bearer token scheme via `Authorization` header

## SQL Injection Prevention
- All queries use **parameterized prepared statements** via `better-sqlite3`
- No string concatenation in SQL queries

## Input Validation
- Username: 3-30 chars, alphanumeric + underscore
- Email: validated with regex
- Password: complexity enforced before hashing
- Chirp content: 1-280 chars
- Comment content: 1-500 chars
- All numeric IDs parsed with `parseInt`

## Rate Limiting
- Auth routes (`/api/auth/*`) limited to **100 requests per 15 minutes** via `express-rate-limit`
- Prevents brute-force attacks on login

## Password Reset
- Reset tokens are generated with `crypto.randomBytes(32)` (cryptographically secure)
- Only the **SHA-256 hash** of the token is stored in the database
- Tokens expire after 1 hour

## Access Control
- Protected routes require valid JWT
- Admin routes additionally require `is_admin === 1`
- Users cannot delete admin accounts
- Users cannot follow themselves
- Private profiles hide chirps from non-followers

## CORS
- Configured to only allow requests from `http://localhost:3000`
