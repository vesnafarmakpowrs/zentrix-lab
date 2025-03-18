import AppDataSource from './orm.config';

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    // Add a small delay to ensure connections are closed
    await new Promise(resolve => setTimeout(resolve, 500));
  }
});

// Increase timeout for all tests
jest.setTimeout(10000);