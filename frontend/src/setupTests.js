// frontend/src/setupTests.js
import '@testing-library/jest-dom';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true
});

// Mock alert
window.alert = jest.fn();

// Mock Cloudinary
window.cloudinary = {
  createUploadWidget: jest.fn().mockReturnValue({
    open: jest.fn()
  })
};

// Mock location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    pathname: '',
    reload: jest.fn()
  },
  writable: true
});