function _isPreviewSession(classroomActivityId) {
  const previewIdRegExp = RegExp('\Aprvw\-.+');
  return previewIdRegExp.test(classroomActivityId);
}

function _isRoleAuthorized(permittedRoles, currentRole) {
  return permittedRoles.includes(currentRole);
}

function _belongsToSession(data, token) {
  return data.classroomActivityId == token.classroom_activity_id;
}

export function authorizeSession(data, token, client, callback) {
  const belongsToSession = _belongsToSession(data, token)

  if (belongsToSession || _isPreviewSession(data.classroomActivityId)) {
    callback();
  } else {
    client.emit('notAuthorizedForSession');
  }
}

export function authorizeTeacherSession(data, token, client, callback) {
  const userIsTeacher    = _isRoleAuthorized(['staff', 'teacher'], token.role);
  const belongsToSession = _belongsToSession(data, token);
  const isValidSession   = userIsTeacher && belongsToSession;

  if (isValidSession || _isPreviewSession(data.classroomActivityId)) {
    callback();
  } else {
    client.emit('notAuthorizedForTeacherSession');
  }
}

export function authorizeRole(permittedRoles, token, client, callback) {
  const isRoleAuthorized = _isRoleAuthorized(permittedRoles, token.role);

  if (isRoleAuthorized || _isPreviewSession(data.classroomActivityId)) {
    callback();
  } else {
    client.emit('notAuthorizedForRole');
  }
}
