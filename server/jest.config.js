module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Adjust this if you have path aliases in your tsconfig.json that Jest needs to understand
    // Example: '^@shared/(.*)$': '<rootDir>/../shared/$1',
    // For now, assuming direct relative paths or node_modules resolution.
    // If server/src uses paths like 'src/config/firebaseAdmin', and tests are in server/src/routes,
    // then Jest might need rootDir or modulePaths configured if imports fail.
    // Default preset should handle most standard TypeScript imports.
  },
  setupFilesAfterEnv: ['./jest.setup.ts'], // For global mocks or setup
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
