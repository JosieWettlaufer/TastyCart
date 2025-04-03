// Frontend Jest config (frontend/jest.config.js)
module.exports = {
    // The root directory that Jest should scan for tests
    rootDir: '.',
    
    // The test environment that will be used
    testEnvironment: 'jsdom',
    
    roots: ['<rootDir>/src'],

    // File extensions Jest will look for
    moduleFileExtensions: ['js', 'jsx'],
    
    // Path mapping for imports
    moduleNameMapper: {
      // Handle CSS imports (if you're using CSS in your components)
      '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
      
      // Handle image imports
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    },
    
    // Setup files to run before each test
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    
    // Code coverage configuration
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/index.js',
      '!src/reportWebVitals.js',
      '!src/setupTests.js',
      '!src/__mocks__/**'
    ],
    coverageDirectory: 'coverage',
    
    // Test file patterns
    testMatch: ['**/__tests__/**/*.test.js'],
    
    // Transform files with Babel
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    },

    transformIgnorePatterns: [
        '/node_modules/(?!axios)/'
    ]
  };