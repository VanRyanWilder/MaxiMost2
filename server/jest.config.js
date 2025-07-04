module.exports = {
  // preset: 'ts-jest', // ts-jest preset is often not needed if using transform
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Relative to server/ where this jest.config.js is
      // isolatedModules: true, // A common option to try if there are TS/Babel conflicts
    }],
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../shared/$1'
    // Add other mappings here if needed, for example:
    // '^@/(.*)$': '<rootDir>/src/$1', // If you use @/ for src folder
  },
  setupFilesAfterEnv: ['./jest.setup.ts'], // For global mocks or setup
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
