import { DecodedCookie } from "./lms_session_decoder";


export function teacherHasPermission(session:any, user:DecodedCookie|null):boolean {
  if (session.public) return true;
  if (user && user.role === 'teacher' && user.lesson_session.classroom_session_id === session.id) return true 
  return false
}

export function userHasPermission(session:any, user:DecodedCookie|null):boolean {
  if (session.public) return true;
  if (user && user.lesson_session && user.lesson_session.classroom_session_id === session.id) return true;
  return false;
}

export function studentHasPermission(session:any, user:DecodedCookie|null):boolean {
  if (session.public) return true;
  if (user && user.role === 'student' && user.lesson_session.classroom_session_id === session.id) return true 
  return false
}