process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../backend/server');

describe('Auth Routes', () => {
  const testUser = {
    username: 'testuser1',
    email: 'testuser1@example.com',
    password: 'Test1234!',
  };

  test('POST /api/auth/register - registers new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(testUser.username);
  });

  test('POST /api/auth/login - logs in user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - wrong password returns 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'WrongPassword1!',
    });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/auth/forgot-password - returns token', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: testUser.email });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('OPTIONS /api/auth/login - CORS preflight from allowed origin returns 204', async () => {
    const res = await request(app)
      .options('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type');
    expect(res.statusCode).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  test('POST /api/auth/login - CORS from 127.0.0.1:3000 returns correct ACAO header', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://127.0.0.1:3000')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://127.0.0.1:3000');
  });
});
