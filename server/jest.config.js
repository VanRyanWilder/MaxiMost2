module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./jest.env.setup.ts'], // Load env vars before test environment
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../shared/$1'
    // Add other mappings here if needed, for example:
    // '^@/(.*)$': '<rootDir>/src/$1', // If you use @/ for src folder
  },
  setupFilesAfterEnv: ['./jest.setup.ts'], // For global mocks or setup
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
