process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../backend/server');

describe('User Routes', () => {
  let token;
  let userId;
  let otherToken;
  let otherUserId;

  beforeAll(async () => {
    const res1 = await request(app).post('/api/auth/register').send({
      username: 'usertest1',
      email: 'usertest1@example.com',
      password: 'Test1234!',
    });
    token = res1.body.token;
    userId = res1.body.user.id;

    const res2 = await request(app).post('/api/auth/register').send({
      username: 'usertest2',
      email: 'usertest2@example.com',
      password: 'Test1234!',
    });
    otherToken = res2.body.token;
    otherUserId = res2.body.user.id;
  });

  test('GET /api/users/:id - get profile', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('usertest1');
  });

  test('POST /api/users/:id/follow - follow user', async () => {
    const res = await request(app)
      .post(`/api/users/${otherUserId}/follow`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Followed successfully');
  });

  test('POST /api/users/:id/unfollow - unfollow user', async () => {
    const res = await request(app)
      .post(`/api/users/${otherUserId}/unfollow`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Unfollowed successfully');
  });

  test('PUT /api/users/privacy - toggle privacy', async () => {
    const res = await request(app)
      .put('/api/users/privacy')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('is_private');
  });
});
