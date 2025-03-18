module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/*.test.ts'],
  testTimeout: 60000,
  setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.ts'],
  forceExit: true,
  detectOpenHandles: true,
  verbose: true
};