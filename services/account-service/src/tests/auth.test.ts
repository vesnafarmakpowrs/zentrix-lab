import request from 'supertest';
import app from "../app";
import AppDataSource from '../config/orm.config';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

describe('Authentication Integration Tests', () => {

  describe('POST /api/auth/register', () => {

    beforeEach(async () => {
      // Clean the test database before each test
      await AppDataSource.getRepository(User).clear();
      // Create a test user
      const user = new User();
      user.username = 'testuser';
      user.password =  await bcrypt.hash('password123', 10);
      user.role = 'GameMaster';

      await AppDataSource.getRepository(User).save(user);
    });

    it('should register a new user successfully', async () => {
     
      const newUser = {
        username: 'testuser1',
        password: 'password123',
        role: 'GameMaster'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('username', newUser.username);
    });

    it('should return 400 if username already exists', async () => {
      // First create a user
      const existingUser = new User();
      existingUser.username = 'testuser';
      existingUser.password = 'password123';
      existingUser.role = 'GameMaster';

      // Try to create the same user again
      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {

        // Clean the test database before each test
        await AppDataSource.getRepository(User).clear();

        // Create a test user
        const user = new User();
        user.username = 'testuser';
        user.password =  await bcrypt.hash('password123', 10);
        user.role = 'GameMaster';

        await AppDataSource.getRepository(User).save(user);

        const credentials = {
          username: 'testuser',
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/auth/login')
          .send(credentials);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
      });

      it('should return 401 for incorrect password', async () => {
        const wrongCredentials = {
          username: 'testuser',
          password: 'wrongpassword'
        };

        const response = await request(app)
          .post('/api/auth/login')
          .send(wrongCredentials);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Invalid credentials');
      });

      it('should return 401 for non-existent user', async () => {
        const nonExistentUser = {
          username: 'nonexistent',
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/auth/login')
          .send(nonExistentUser);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Invalid credentials');
      });
    });
  });