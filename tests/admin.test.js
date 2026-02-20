process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../backend/server');

describe('Admin Routes', () => {
  let adminToken;
  let userToken;
  let newUserId;

  beforeAll(async () => {
    // Login as admin
    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'admin@birdy.com',
      password: 'Admin1234!',
    });
    adminToken = adminRes.body.token;

    // Register a regular user to test deletion
    const userRes = await request(app).post('/api/auth/register').send({
      username: 'todelete',
      email: 'todelete@example.com',
      password: 'Test1234!',
    });
    userToken = userRes.body.token;
    newUserId = userRes.body.user.id;
  });

  test('GET /api/admin/users - list users (admin)', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  test('GET /api/admin/users - non-admin cannot access', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('DELETE /api/admin/users/:id - delete user (admin)', async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${newUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });
});
