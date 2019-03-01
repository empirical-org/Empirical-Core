import { 
  teacherHasPermission, 
  userHasPermission,
  studentHasPermission
 } from "./permissions";

const exampleSession = {
  id: "abc-123",
  public: false
};
const publicSession = {
  id: "xyz-789",
  public: true
}
const teacherWithCorrectPermissions = {
  user_id: 456,
  role: 'teacher',
  lesson_session: {
    role: 'teacher',
    classroom_session_id: "abc-123"
  }
};
const teacherWithIncorrectPermissions = Object.assign({}, 
  teacherWithCorrectPermissions, 
  {lesson_session: {
    role: 'teacher',
    classroom_session_id: "cba-321"
  }})
const studentInSession = {
  user_id: 654,
  role: 'student',
  lesson_session: {
    role: 'student',
    classroom_session_id: "abc-123"
  }
}

test('checking lessons permissions for a teacher', () => {
  // Private Session
  expect(teacherHasPermission(exampleSession, teacherWithCorrectPermissions)).toBe(true)
  expect(teacherHasPermission(exampleSession, teacherWithIncorrectPermissions)).toBe(false)
  expect(teacherHasPermission(exampleSession, {})).toBe(false)
  expect(teacherHasPermission(exampleSession, studentInSession)).toBe(false)
  // Public Session
  expect(teacherHasPermission(publicSession, teacherWithCorrectPermissions)).toBe(true)
  expect(teacherHasPermission(publicSession, teacherWithIncorrectPermissions)).toBe(true)
  expect(teacherHasPermission(publicSession, {})).toBe(true)
  expect(teacherHasPermission(publicSession, studentInSession)).toBe(true)
})

test('checking lessons permissions for a user', () => {
  // Private Session
  expect(userHasPermission(exampleSession, teacherWithCorrectPermissions)).toBe(true)
  expect(userHasPermission(exampleSession, teacherWithIncorrectPermissions)).toBe(false)
  expect(userHasPermission(exampleSession, {})).toBe(false)
  expect(userHasPermission(exampleSession, studentInSession)).toBe(true)
  // Public Session
  expect(userHasPermission(publicSession, teacherWithCorrectPermissions)).toBe(true)
  expect(userHasPermission(publicSession, teacherWithIncorrectPermissions)).toBe(true)
  expect(userHasPermission(publicSession, {})).toBe(true)
  expect(userHasPermission(publicSession, studentInSession)).toBe(true)
})

test('checking lessons permissions for a student', () => {
  // Private Session
  expect(studentHasPermission(exampleSession, teacherWithCorrectPermissions)).toBe(false)
  expect(studentHasPermission(exampleSession, teacherWithIncorrectPermissions)).toBe(false)
  expect(studentHasPermission(exampleSession, {})).toBe(false)
  expect(studentHasPermission(exampleSession, studentInSession)).toBe(true)
  // Public Session
  expect(studentHasPermission(publicSession, teacherWithCorrectPermissions)).toBe(true)
  expect(studentHasPermission(publicSession, teacherWithIncorrectPermissions)).toBe(true)
  expect(studentHasPermission(publicSession, {})).toBe(true)
  expect(studentHasPermission(publicSession, studentInSession)).toBe(true)
})