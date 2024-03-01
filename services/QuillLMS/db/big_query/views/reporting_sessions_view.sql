SELECT
  activity_sessions.id as session_id,
  activity_sessions.user_id as student_id,
  activity_sessions.activity_id as activity_id,
  activities.name as activity_name,
  schools.id as school_id, schools.name as school_name,
  classrooms_teachers.user_id as teacher_id,
  users.name as teacher_name,
  classrooms.id as classroom_id,
  classrooms.name AS classroom_name,
  classrooms.grade as grade,
  activity_sessions.completed_at as completed_at,
  activity_sessions.timespent as timespent,
  activities.question_count as question_count
FROM activity_sessions
  INNER JOIN activities ON activities.id = activity_sessions.activity_id
  INNER JOIN classroom_units ON classroom_units.id = activity_sessions.classroom_unit_id
  INNER JOIN classrooms ON classrooms.id = classroom_units.classroom_id
  INNER JOIN classrooms_teachers ON classrooms_teachers.classroom_id = classrooms.id
  INNER JOIN schools_users ON schools_users.user_id = classrooms_teachers.user_id
  INNER JOIN schools ON schools.id = schools_users.school_id
  INNER JOIN users on users.id = classrooms_teachers.user_id
WHERE classrooms_teachers.role = 'owner' AND activity_sessions.completed_at IS NOT NULL AND activity_sessions.completed_at > '2021-07-31'
GROUP BY
  session_id,
  student_id,
  activity_id,
  activity_name,
  school_id,
  school_name,
  teacher_id,
  teacher_name,
  classroom_id,
  classroom_name,
  grade,
  completed_at,
  timespent,
  question_count
