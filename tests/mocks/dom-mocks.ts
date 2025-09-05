/**
 * DOM mocks for testing environments
 */
import { vi } from 'vitest';

// Mock localStorage
export const localStorageMock = {
  getItem: vi.fn((key: string) => null),
  setItem: vi.fn((key: string, value: string) => {}),
  removeItem: vi.fn((key: string) => {}),
  clear: vi.fn(() => {}),
  length: 0,
  key: vi.fn((index: number) => null),
};

// Mock sessionStorage
export const sessionStorageMock = {
  getItem: vi.fn((key: string) => null),
  setItem: vi.fn((key: string, value: string) => {}),
  removeItem: vi.fn((key: string) => {}),
  clear: vi.fn(() => {}),
  length: 0,
  key: vi.fn((index: number) => null),
};

// Mock window.matchMedia
export const matchMediaMock = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock IntersectionObserver
export const intersectionObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
export const resizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock fetch
export const fetchMock = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
    statusText: 'OK',
  })
);

// Setup all mocks
export function setupDOMMocks() {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMediaMock,
  });

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: intersectionObserverMock,
  });

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: resizeObserverMock,
  });

  Object.defineProperty(global, 'fetch', {
    writable: true,
    value: fetchMock,
  });
}

// Reset all mocks
export function resetDOMMocks() {
  localStorageMock.getItem.mockReset();
  localStorageMock.setItem.mockReset();
  localStorageMock.removeItem.mockReset();
  localStorageMock.clear.mockReset();

  sessionStorageMock.getItem.mockReset();
  sessionStorageMock.setItem.mockReset();
  sessionStorageMock.removeItem.mockReset();
  sessionStorageMock.clear.mockReset();

  matchMediaMock.mockReset();
  intersectionObserverMock.mockReset();
  resizeObserverMock.mockReset();
  fetchMock.mockReset();
}