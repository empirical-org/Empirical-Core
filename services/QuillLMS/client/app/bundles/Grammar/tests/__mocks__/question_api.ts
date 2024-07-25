export const mockQuestionApi = {
  getAllForType: jest.fn().mockImplementation(() => Promise.resolve({})),
  getAll: jest.fn().mockImplementation(() => Promise.resolve({})),
  get: jest.fn().mockImplementation(() => Promise.resolve({})),
  create: jest.fn().mockImplementation(() => Promise.resolve({})),
  update: jest.fn().mockImplementation(() => Promise.resolve({})),
}
