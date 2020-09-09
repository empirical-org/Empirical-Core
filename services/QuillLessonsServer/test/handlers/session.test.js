import {
  _setSessionDefaults,
  createOrUpdateClassroomLessonSession,
} from '../../src/handlers/sessions';

// import for mocking
import r from 'rethinkdb';

describe('createOrUpdateClassroomLessonSession', () => {
  // This test only throws warnings on error
  it("createOrUpdateClassroomLessonSession to process record not found", () => {
    const input = {connection: null, classroomSessionId: null, teacherIdObject: null};

    r.run.mockResolvedValue(null);

    expect(createOrUpdateClassroomLessonSession(input)).toBeUndefined;
  });

  it("should _setSessionDefaults on a null session", () => {
    const session = _setSessionDefaults(null, '123', null);

    expect(session).toHaveProperty('id', '123');
    expect(session).toHaveProperty('current_slide', 0);
    expect(session).not.toHaveProperty('teacher_ids');
    expect(session).toHaveProperty('startTime');
  });

  it("should _setSessionDefaults on a non-null session", () => {
    const foundSession = {id: '321', current_slide: 18, startTime: 'A time'};
    const teacher = {teacher_ids: [1,3,5]};
    const session = _setSessionDefaults(foundSession, '123', teacher);

    expect(session).toHaveProperty('id', '321');
    expect(session).toHaveProperty('current_slide', 18);
    expect(session).toHaveProperty('teacher_ids', [1,3,5]);
    expect(session).toHaveProperty('startTime', 'A time');
  });
});
