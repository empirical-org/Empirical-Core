SELECT 
    activity_sessions.user_id AS user_id,
    pre_diagnostic_activity_sessions.activity_id AS activity_id,
    activities.name AS activity_name,
    classroom_units.classroom_id AS classroom_id,
    classrooms.name AS classroom_name,
    schools_users.school_id AS school_id,
    classrooms_teachers.user_id AS teacher_id,
    users.name AS teacher_name,
    classrooms.grade AS grade,
    pre_diagnostic_activity_sessions.completed_at AS pre_diagnostic_completed_at,
    COUNT(DISTINCT activity_sessions.id) AS completed_activities, 
    SUM(activity_sessions.timespent) AS time_spent_seconds
  FROM lms.activity_sessions
  JOIN lms.classroom_units
    ON activity_sessions.classroom_unit_id = classroom_units.id
  JOIN lms.units
    ON classroom_units.unit_id = units.id
  JOIN lms.classrooms
    ON classroom_units.classroom_id = classrooms.id
  JOIN lms.classrooms_teachers
    ON classrooms.id = classrooms_teachers.classroom_id
      AND classrooms_teachers.role = 'owner'
  JOIN lms.schools_users
    ON classrooms_teachers.user_id = schools_users.user_id
  JOIN lms.users
    ON schools_users.user_id = users.id
  JOIN lms.recommendations
    ON units.unit_template_id = recommendations.unit_template_id
  JOIN lms.activity_sessions AS pre_diagnostic_activity_sessions
    ON recommendations.activity_id = pre_diagnostic_activity_sessions.activity_id
      AND activity_sessions.user_id = pre_diagnostic_activity_sessions.user_id
      AND activity_sessions.completed_at > pre_diagnostic_activity_sessions.completed_at
  JOIN lms.classroom_units AS pre_diagnostic_classroom_units
    ON pre_diagnostic_activity_sessions.classroom_unit_id = pre_diagnostic_classroom_units.id
      AND classroom_units.classroom_id = pre_diagnostic_classroom_units.classroom_id
  JOIN lms.activities
    ON pre_diagnostic_activity_sessions.activity_id = activities.id
  WHERE activity_sessions.visible = true
    AND pre_diagnostic_activity_sessions.visible = true
    AND activity_sessions.completed_at >= '2023-07-01'
  GROUP BY user_id, activity_id, activity_name, classroom_id, classroom_name, school_id, teacher_id, teacher_name, grade, pre_diagnostic_completed_at
