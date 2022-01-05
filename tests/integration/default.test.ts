import app from '../../src/server';
import request from 'supertest';
import { createDbConnection, connection } from '../../src/utils/connection';

describe('GET / - Default route', () => {
  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    await createDbConnection();
  });
  it('should return 200 and have version key', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('version');
  });
  afterAll((done) => {
    connection.close();
    app.close();
    done();
  });
});
