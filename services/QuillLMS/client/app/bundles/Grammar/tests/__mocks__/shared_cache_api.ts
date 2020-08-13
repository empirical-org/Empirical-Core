export const mockSharedCacheApi = {
  get: jest.fn().mockImplementation(() => Promise.resolve({})),
  update: jest.fn().mockImplementation(() => Promise.resolve({})),
  remove: jest.fn().mockImplementation(() => Promise.resolve({})),
}
