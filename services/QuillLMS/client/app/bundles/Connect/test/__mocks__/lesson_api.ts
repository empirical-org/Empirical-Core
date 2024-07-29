export const mockLessonApi = {
  getAll: jest.fn().mockImplementation(() => Promise.resolve({})),
  get: jest.fn().mockImplementation(() => Promise.resolve({})),
  create: jest.fn().mockImplementation(() => Promise.resolve({})),
  update: jest.fn().mockImplementation(() => Promise.resolve({})),
  remove: jest.fn().mockImplementation(() => Promise.resolve({})),
  addQuestion: jest.fn().mockImplementation(() => Promise.resolve({})),
}
