export const mockQuestionApi = {
  getAll: jest.fn().mockImplementation(() => Promise.resolve({})),
  get: jest.fn().mockImplementation(() => Promise.resolve({})),
  updateFlag: jest.fn().mockImplementation(() => Promise.resolve({})),
  create: jest.fn().mockImplementation(() => Promise.resolve({question: {}})),
  update: jest.fn().mockImplementation(() => Promise.resolve({})),
}