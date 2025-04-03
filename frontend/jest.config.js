// Frontend Jest config (frontend/jest.config.js)
module.exports = {
    // The root directory that Jest should scan for tests
    rootDir: '.',
    
    // The test environment that will be used
    testEnvironment: 'jsdom',
    
    // The directories to search for tests
    roots: ['<rootDir>/src'],
  
    // File extensions Jest will look for
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    
    // Path mapping for imports
    moduleNameMapper: {
      // Handle CSS imports (if you're using CSS in your components)
      '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
      
      // Handle image imports
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
      
      // Handle module aliases if you have any in webpack
      '^@/(.*)$': '<rootDir>/src/$1'
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
      '!src/__mocks__/**',
      '!**/node_modules/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'clover'],
    
    // Test file patterns - add more flexibility to find tests
    testMatch: [
      '**/__tests__/**/*.test.{js,jsx}',
      '**/*.{spec,test}.{js,jsx}'
    ],
    
    // Transform files with Babel
    transform: {
      '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.js' }]
    },
  
    // Ignore transforming specific node_modules except those that need it
    transformIgnorePatterns: [
      '/node_modules/(?!(axios|@stripe|@cloudinary|jwt-decode|react-router-dom)/)'
    ],
    
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    
    // The maximum amount of workers used to run your tests
    maxWorkers: '50%',
    
    // Display individual test results with the test suite hierarchy
    verbose: true,
    
    // Indicates whether each individual test should be reported during the run
    notify: false,
    
    // Indicates whether the coverage information should be displayed in the output
    coverageThreshold: {
      global: {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0
      }
    },
    
    // A list of reporter names that Jest uses when writing coverage reports
    testResultsProcessor: undefined,
    
    // The default timeout of a test in milliseconds
    testTimeout: 30000
  };