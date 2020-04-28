const mockRequestDelete = jest.fn().mockImplementation(() => Promise.resolve({}))
const mockRequestGet = jest.fn().mockImplementation(() => Promise.resolve({}))
const mockRequestPost = jest.fn().mockImplementation(() => Promise.resolve({}))
const mockRequestPut = jest.fn().mockImplementation(() => Promise.resolve({}))

export {
  mockRequestDelete,
  mockRequestGet,
  mockRequestPost,
  mockRequestPut,
}
