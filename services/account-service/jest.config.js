module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/src/tests/*.test.ts'],
    testTimeout: 10000,
    setupFilesAfterEnv: ['<rootDir>/src/config/jest.config.ts']
  };