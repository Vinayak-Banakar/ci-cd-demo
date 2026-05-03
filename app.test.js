const request = require('supertest');
const app = require('./app');

test('GET / returns status ok', async () => {
  const res = await request(app).get('/');
  expect(res.body.status).toBe('ok');
});

test('GET /health returns healthy true', async () => {
  const res = await request(app).get('/health');
  expect(res.body.healthy).toBe(true);
});

