function _isPreviewSession(data) {
  const previewIdRegExp = RegExp('^prvw\-.+$');
  return previewIdRegExp.test(data.classroomUnitId);
}

function _checkUserRole(permittedRoles, currentRole) {
  const authorizedRole = permittedRoles.includes(currentRole)
  const previewSession = _isPreviewSession(data)

  if (previewSession || authorizedRole) {
    return true
  }

  let error  = Error.new('User role is not authorized for this action');
  error.name = 'UnauthorizedUserRoleError';
  throw error;
}

function _checkUserSession(data, token) {
  const ClassroomUnitIdRegExp = new RegExp('^' + token.data.classroom_unit_id);
  const sessionAuthorized     = ClassroomUnitIdRegExp.test(data.classroomSessionId);
  const previewSession        = _isPreviewSession(data)

  if (previewSession || sessionAuthorized) {
    return true
  }

  let error  = Error.new('User classroom session is not authorized for this action');
  error.name = 'UnauthorizedUserSessionError';
  throw error;
}

export function authorizeSession(data, token, callback) {
  _checkUserSession(data, token);

  callback();
}

export function authorizeRole(permittedRoles, data, token, callback) {
  _checkUserRole(permittedRoles, token.data.role);

  callback();
}
