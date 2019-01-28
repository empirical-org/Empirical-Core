

export function teacherHasPermission(session:any, user:any):boolean {
  if (session.public) return true;
  if (user.role === 'teacher' && user.lesson_session.classroom_session_id === session.id) return true 
  return false
}

export function userHasPermission(session:any, user:any):boolean {
  if (session.public) return true;
  if (user.lesson_session && user.lesson_session.classroom_session_id === session.id) return true;
  return false;
}