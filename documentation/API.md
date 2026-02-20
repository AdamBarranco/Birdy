# Birdy API Reference

Base URL: `http://localhost:5000/api`

All protected endpoints require `Authorization: Bearer <token>` header.

---

## Auth

### POST /auth/register
Register a new user.

**Body:**
```json
{ "username": "birdy_user", "email": "user@example.com", "password": "Secure1!" }
```
**Response (201):**
```json
{ "token": "<jwt>", "user": { "id": 1, "username": "birdy_user", "is_admin": 0 } }
```

### POST /auth/login
Login with email and password.

**Body:**
```json
{ "email": "user@example.com", "password": "Secure1!" }
```
**Response (200):**
```json
{ "token": "<jwt>", "user": { "id": 1, "username": "birdy_user", "is_admin": 0 } }
```

### POST /auth/forgot-password
Generate a password reset token.

**Body:**
```json
{ "email": "user@example.com" }
```
**Response (200):**
```json
{ "token": "<plain_token>", "message": "Password reset token generated" }
```

---

## Chirps (Protected)

### GET /chirps
Get feed (own chirps + followed users' chirps).

**Response (200):**
```json
{ "chirps": [{ "id": 1, "user_id": 1, "content": "Hello!", "created_at": 1700000000, "username": "birdy_user", "likes": 2, "dislikes": 0, "comment_count": 1 }] }
```

### POST /chirps
Create a new chirp (1-280 chars).

**Body:**
```json
{ "content": "Hello Birdy world!" }
```
**Response (201):**
```json
{ "chirp": { "id": 2, "user_id": 1, "content": "Hello Birdy world!", "created_at": 1700000001 } }
```

### GET /chirps/:id/comments
Get comments for a chirp.

**Response (200):**
```json
{ "comments": [{ "id": 1, "chirp_id": 2, "user_id": 1, "content": "Nice!", "username": "other_user", "created_at": 1700000002 }] }
```

### POST /chirps/:id/comment
Add a comment to a chirp (1-500 chars).

**Body:**
```json
{ "content": "Great chirp!" }
```
**Response (201):**
```json
{ "comments": [...] }
```

### POST /chirps/:id/like
Like a chirp (upserts reaction).

**Response (200):**
```json
{ "reactions": [{ "id": 1, "chirp_id": 2, "user_id": 1, "type": "like" }] }
```

### POST /chirps/:id/dislike
Dislike a chirp (upserts reaction).

**Response (200):**
```json
{ "reactions": [...] }
```

---

## Users (Protected)

### GET /users/:id
Get user profile. Returns limited info if private and not following.

**Response (200):**
```json
{ "id": 1, "username": "birdy_user", "is_private": 0, "followers": 10, "following": 5, "is_following": false, "chirps": [...] }
```

### POST /users/:id/follow
Follow a user.

**Response (200):**
```json
{ "message": "Followed successfully" }
```

### POST /users/:id/unfollow
Unfollow a user.

**Response (200):**
```json
{ "message": "Unfollowed successfully" }
```

### PUT /users/privacy
Toggle own account privacy.

**Response (200):**
```json
{ "is_private": 1 }
```

---

## Admin (Protected + Admin only)

### GET /admin/users
List all users with stats.

**Response (200):**
```json
{ "users": [...], "stats": { "totalUsers": 10, "totalChirps": 50, "newUsersThisWeek": 3 } }
```

### DELETE /admin/users/:id
Delete a user (cannot delete admin users).

**Response (200):**
```json
{ "message": "User deleted successfully" }
```
