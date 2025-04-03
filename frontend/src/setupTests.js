// frontend/src/setupTests.js
import '@testing-library/jest-dom';

// Enhanced localStorage mock with proper return values and state management
const localStorageMock = (() => {
  let store = {};
  
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Enhanced location mock with search parameters
const locationMock = {
  href: 'http://localhost/',
  pathname: '/',
  search: '',
  hash: '',
  reload: jest.fn(),
  assign: jest.fn(),
  replace: jest.fn()
};

Object.defineProperty(window, 'location', {
  value: locationMock,
  writable: true
});

// Add URLSearchParams mock for query string parsing
window.URLSearchParams = jest.fn().mockImplementation(query => {
  const params = new Map();
  if (query) {
    query.split('&').forEach(param => {
      const [key, value] = param.split('=');
      params.set(key, value);
    });
  }
  
  return {
    get: jest.fn(key => params.get(key) || null),
    has: jest.fn(key => params.has(key)),
    set: jest.fn((key, value) => params.set(key, value)),
    delete: jest.fn(key => params.delete(key))
  };
});

// Mock alert and confirm
window.alert = jest.fn();
window.confirm = jest.fn(() => true);

// Enhanced Cloudinary mock
window.cloudinary = {
  createUploadWidget: jest.fn().mockReturnValue({
    open: jest.fn(),
    close: jest.fn(),
    destroy: jest.fn()
  })
};

// Mock for window.fs for file reading (used in your CloudinaryUpload component)
window.fs = {
  readFile: jest.fn().mockResolvedValue(new Uint8Array())
};

// Mock Stripe-related globals if needed
window.Stripe = jest.fn().mockReturnValue({
  elements: jest.fn().mockReturnValue({
    create: jest.fn().mockReturnValue({
      mount: jest.fn(),
      on: jest.fn(),
      unmount: jest.fn()
    })
  }),
  createToken: jest.fn().mockResolvedValue({ token: { id: 'test-token-id' } })
});

// Add any missing fetch mock if you're using it
global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({}),
  ok: true,
  status: 200
});

// Fix for setupTests.js
const originalConsoleError = console.error;
console.error = (...args) => {
  // Check if first argument is a string before calling includes
  if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
    return;
  }
  originalConsoleError(...args);
};