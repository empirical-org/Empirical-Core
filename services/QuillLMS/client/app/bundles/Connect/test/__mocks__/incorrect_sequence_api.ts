export const mockIncorrectSequenceApi = {
  create: jest.fn().mockImplementation(() => Promise.resolve({})),
  update: jest.fn().mockImplementation(() => Promise.resolve({})),
  updateAllForQuestion: jest.fn().mockImplementation(() => Promise.resolve({})),
  remove: jest.fn().mockImplementation(() => Promise.resolve({})),
}