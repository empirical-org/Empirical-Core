
// Mock these calls to return 'this' to allow them to be chainable
export default {
  get: jest.fn().mockReturnThis(),
  run: jest.fn().mockReturnThis(),
  table: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
};
