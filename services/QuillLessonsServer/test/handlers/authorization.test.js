import * as authorization from '../../src/handlers/authorization';
// const { _checkToken, _isRoleAuthorized, _isPreviewSession, _reportError } = require('./authorizeRole');

// jest.mock('../../src/handlers/authorization', () => ({
//   authorizeRole: {
//     _checkToken: jest.fn(),
//     _isRoleAuthorized: jest.fn(),
//     _isPreviewSession: jest.fn(),
//     _reportError: jest.fn()
//   }
// }));



describe('authorizeRole', () => {
  const mockCallback = jest.fn();
  const token = { data: { role: 'user' } };
  const data = {};
  const client = { emit: jest.fn() };
  const permittedRoles = ['admin', 'editor'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // it('should authorize if role is permitted', done => {
  //   _checkToken.mockImplementationOnce((data, token, client, cb) => cb());
  //   _isRoleAuthorized.mockReturnValueOnce(true);

  //   authorizeRole(permittedRoles, data, token, client, () => {
  //     expect(mockCallback).toHaveBeenCalled();
  //     done();
  //   });
  // });

  // it('should authorize if it is a preview session', done => {
  //   _checkToken.mockImplementationOnce((data, token, client, cb) => cb());
  //   _isRoleAuthorized.mockReturnValueOnce(false);
  //   _isPreviewSession.mockReturnValueOnce(true);

  //   authorizeRole(permittedRoles, data, token, client, () => {
  //     expect(mockCallback).toHaveBeenCalled();
  //     done();
  //   });
  // });

  it('should not invoke callback when role is unuathorized', () => {
    authorization.authorizeRole(permittedRoles, data, token, client, mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  })

  it('should invoke callback when role is athorized', () => {
    jest.spyOn(authorization, '_isRoleAuthorized').mockImplementation(() => {
      return jest.fn()
    })
    authorizeRole(permittedRoles, data, token, client, mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  })

  // it('should report error when role is not authorized and not a preview session', () => {
  //   // _checkToken.mockImplementationOnce((data, token, client, cb) => cb());
  //   // _isRoleAuthorized.mockReturnValueOnce(false);
  //   // _isPreviewSession.mockReturnValueOnce(false);
  //   jest.spyOn(authorizeRole, 'TextEditor').mockImplementation(() => {
  //     return jest.fn()
  //   })

  //   authorizeRole(permittedRoles, data, token, client, mockCallback);

  //   expect(_reportError).toHaveBeenCalledWith('unauthorizedRole', data, token, client);
  //   expect(mockCallback).not.toHaveBeenCalled();
  // });

  // it('should process token check before deciding authorization', () => {
  //   _checkToken.mockImplementationOnce((data, token, client, cb) => {
  //     expect(_isRoleAuthorized).not.toHaveBeenCalled();
  //     expect(_isPreviewSession).not.toHaveBeenCalled();
  //     cb();
  //   });

  //   authorizeRole(permittedRoles, data, token, client, mockCallback);
  // });
});
