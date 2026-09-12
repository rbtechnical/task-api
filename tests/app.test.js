process.env.API_KEY = 'test-key';
const request = require('supertest');
const app = require('../server');
const res = request(app).get('/tasks').set('x-api-key', 'test-key');

describe('Task API', () => {
  it('health check returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });

  it('rejects a task with no title', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
  });

  it('creates a task', async () => {
    const res = await request(app).post('/tasks').send({ title: 'write tests' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('write tests');
    expect(res.body.done).toBe(false);
  });

  it('marks a task done', async () => {
    const created = await request(app).post('/tasks').send({ title: 'ship it' });
    const res = await request(app).patch(`/tasks/${created.body.id}/done`);
    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);
  });
});