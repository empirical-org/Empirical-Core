import { teacherHasPermission } from "./permissions";

test('checking lessons permissions for a teacher', () => {
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
  expect(teacherHasPermission(exampleSession, teacherWithCorrectPermissions)).toBe(true)
  expect(teacherHasPermission(exampleSession, teacherWithIncorrectPermissions)).toBe(false)
  expect(teacherHasPermission(exampleSession, {})).toBe(false)
  expect(teacherHasPermission(exampleSession, studentInSession)).toBe(false)

  expect(teacherHasPermission(publicSession, teacherWithCorrectPermissions)).toBe(true)
  expect(teacherHasPermission(publicSession, teacherWithIncorrectPermissions)).toBe(true)
  expect(teacherHasPermission(publicSession, {})).toBe(true)
  expect(teacherHasPermission(publicSession, studentInSession)).toBe(true)
})