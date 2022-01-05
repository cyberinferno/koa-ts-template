import app from '../../src/server';
import request from 'supertest';
import { createDbConnection, connection } from '../../src/utils/connection';

describe('AuthController Tests', () => {
  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    await createDbConnection();
  });

  describe('POST /auth/register - Register route', () => {
    it('should return 400 for missing parameters', async () => {
      const response = await request(app).post('/auth/register');
      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.any(String),
            type: expect.any(String),
            context: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('POST /auth/login - Login route', () => {
    it('should return 400 for missing parameters', async () => {
      const response = await request(app).post('/auth/login');
      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.any(String),
            type: expect.any(String),
            context: expect.any(String),
          }),
        ]),
      );
    });

    it('should return 400 for invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({email: 'invalid@email.com', password: 'invalid'});
      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('Invalid email or password'),
            type: expect.stringContaining('field.invalid'),
            context: expect.stringContaining('email'),
          }),
        ]),
      );
    });
  });

  afterAll((done) => {
    connection.close();
    app.close();
    done();
  });
});
