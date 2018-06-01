function _isPreviewSession(data) {
  const previewIdRegExp = RegExp('^prvw\-.+$');
  return previewIdRegExp.test(data.classroomActivityId);
}

function _isRoleAuthorized(permittedRoles, currentRole) {
  return permittedRoles.includes(currentRole);
}

function _belongsToSession(data, token) {
  return data.classroomActivityId == token.classroom_activity_id;
}

export function authorizeSession(data, token, client, callback) {
  const belongsToSession = _belongsToSession(data, token)

  if (belongsToSession || _isPreviewSession(data)) {
    callback();
  } else {
    console.error({ error: 'unauthorizedSession', data, token });
    client.emit('unauthorizedSession', { data, token });
  }
}

export function authorizeTeacherSession(data, token, client, callback) {
  const userIsTeacher    = _isRoleAuthorized(['staff', 'teacher'], token.role);
  const belongsToSession = _belongsToSession(data, token);
  const isValidSession   = userIsTeacher && belongsToSession;

  if (isValidSession || _isPreviewSession(data)) {
    callback();
  } else {
    console.error({ error: 'unauthorizedTeacherSession', data, token });
    client.emit('unauthorizedTeacherSession', { data, token });
  }
}

export function authorizeRole(permittedRoles, data, token, client, callback) {
  const isRoleAuthorized = _isRoleAuthorized(permittedRoles, token.role);

  if (isRoleAuthorized || _isPreviewSession(data)) {
    callback();
  } else {
    console.error({ error: 'unauthorizedRole', data, token });
    client.emit('unauthorizedRole', { data, token });
  }
}
