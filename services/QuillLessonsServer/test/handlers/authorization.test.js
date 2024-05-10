import * as authorization from '../../src/handlers/authorization';

describe('authorizeRole', () => {
  const mockCallback = jest.fn();
  const token = { data: { role: 'user' } };
  const data = {};
  const client = { emit: jest.fn() };
  const permittedRoles = ['admin', 'editor'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not invoke callback when role is unuathorized', () => {
    authorization.authorizeRole(permittedRoles, data, token, client, mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  })

  it('should invoke callback when role is authorized', () => {
    const tokenWithRole = { data: { role: 'admin'}, isValid: true }
    authorization.authorizeRole(['admin'], data, tokenWithRole, client, mockCallback);
    expect(mockCallback).toHaveBeenCalled();
  })

});
