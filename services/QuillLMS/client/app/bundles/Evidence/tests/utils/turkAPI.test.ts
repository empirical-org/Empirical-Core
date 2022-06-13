const mockApiFetch = jest.fn().mockImplementation((arg1, arg2) => Promise.resolve({}));

jest.mock('../../../Staff/helpers/evidence/routingHelpers', () => ({
  apiFetch: mockApiFetch
}));

const mockPostTurkSession = async (arg1: string, arg2: string) => {
  const response = await mockApiFetch(arg1, arg2);
  return {};
};

jest.mock('../../utils/turkAPI', () => ({
  postTurkSession: mockPostTurkSession
}))


describe('postTurkSession', () => {
  it('makes a POST request to the turking round activity sessions API', () => {
    const mockTurkingRoundID = '17';
    const mockActivitySessionUID = 'praia-vermelha'
    mockPostTurkSession(mockTurkingRoundID, mockActivitySessionUID).then(() => {
      expect(mockApiFetch).toHaveBeenCalledWith(mockTurkingRoundID, mockActivitySessionUID);
    });
  })
})
