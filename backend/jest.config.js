// Backend Jest config (backend/jest.config.js)
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverage: true,
    collectCoverageFrom: [
      'controllers/**/*.js',
      'middleware/**/*.js',
      'routes/**/*.js',
      '!**/node_modules/**'
    ],
    coverageDirectory: 'coverage'
  };
  
  // Frontend mock files
  // frontend/src/__mocks__/styleMock.js
  module.exports = {};
  
  // frontend/src/__mocks__/fileMock.js
  module.exports = 'test-file-stub';
  