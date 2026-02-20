process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../backend/server');

describe('Chirp Routes', () => {
  let token;
  let chirpId;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
      username: 'chirpuser',
      email: 'chirpuser@example.com',
      password: 'Test1234!',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'chirpuser@example.com',
      password: 'Test1234!',
    });
    token = res.body.token;
  });

  test('POST /api/chirps - create chirp', async () => {
    const res = await request(app)
      .post('/api/chirps')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello Birdy!' });
    expect(res.statusCode).toBe(201);
    expect(res.body.chirp).toHaveProperty('id');
    chirpId = res.body.chirp.id;
  });

  test('GET /api/chirps - get feed', async () => {
    const res = await request(app)
      .get('/api/chirps')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('chirps');
    expect(Array.isArray(res.body.chirps)).toBe(true);
  });

  test('POST /api/chirps/:id/comment - add comment', async () => {
    const res = await request(app)
      .post(`/api/chirps/${chirpId}/comment`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Great chirp!' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('comments');
  });

  test('POST /api/chirps/:id/like - like chirp', async () => {
    const res = await request(app)
      .post(`/api/chirps/${chirpId}/like`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reactions');
  });

  test('POST /api/chirps/:id/dislike - dislike chirp', async () => {
    const res = await request(app)
      .post(`/api/chirps/${chirpId}/dislike`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reactions');
  });
});
