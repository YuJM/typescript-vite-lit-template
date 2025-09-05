/**
 * Test fixtures and mock data for components
 */

// MyElement component fixtures
export const myElementFixtures = {
  default: {
    name: 'World',
    count: 0,
  },
  custom: {
    name: 'Test User',
    count: 5,
  },
  edge_cases: {
    empty_name: {
      name: '',
      count: 0,
    },
    large_count: {
      name: 'Test',
      count: 999999,
    },
    negative_count: {
      name: 'Test',
      count: -1,
    },
  },
};

// TodoList component fixtures
export const todoListFixtures = {
  empty: {
    items: [],
  },
  single_item: {
    items: [
      {
        id: '1',
        text: 'First todo item',
        completed: false,
        createdAt: new Date('2024-01-01'),
      },
    ],
  },
  multiple_items: {
    items: [
      {
        id: '1',
        text: 'First todo item',
        completed: false,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        text: 'Second todo item',
        completed: true,
        createdAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        text: 'Third todo item',
        completed: false,
        createdAt: new Date('2024-01-03'),
      },
    ],
  },
  all_completed: {
    items: [
      {
        id: '1',
        text: 'Completed item 1',
        completed: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        text: 'Completed item 2',
        completed: true,
        createdAt: new Date('2024-01-02'),
      },
    ],
  },
};

// Generic test data
export const testData = {
  strings: {
    short: 'Test',
    long: 'This is a very long string that might be used to test edge cases in components',
    empty: '',
    whitespace: '   ',
    special_characters: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    unicode: '🌟 Unicode test 한글 测试',
  },
  numbers: {
    zero: 0,
    positive: 42,
    negative: -42,
    large: 999999999,
    small: 0.001,
    infinity: Infinity,
    nan: NaN,
  },
  dates: {
    past: new Date('2020-01-01'),
    present: new Date(),
    future: new Date('2030-01-01'),
  },
};

// Event fixtures for testing user interactions
export const eventFixtures = {
  click: new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }),
  keypress: {
    enter: new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    }),
    escape: new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    }),
    space: new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
    }),
  },
  input: (value: string) => {
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', {
      value: { value },
      writable: false,
    });
    return event;
  },
};