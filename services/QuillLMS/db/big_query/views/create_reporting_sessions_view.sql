CREATE MATERIALIZED VIEW analytics-data-stores.lms.recent_reporting_sessions as (
  SELECT
   activity_sessions.user_id as student_id,
   activity_sessions.activity_id as activity_id,
   schools.id as school_id,
   classrooms_teachers.user_id as teacher_id,
   classrooms.id as classroom_id,
   classrooms.grade as grade,
   DATETIME_TRUNC(activity_sessions.completed_at, DAY) as completed_date,
   SUM(activity_sessions.timespent) as time_spent,
   SUM(activities.question_count) as question_count,
   Count(activity_sessions.id) as activity_count
  FROM lms.activity_sessions
   INNER JOIN lms.activities ON activities.id = activity_sessions.activity_id
   INNER JOIN lms.classroom_units ON classroom_units.id = activity_sessions.classroom_unit_id
   INNER JOIN lms.classrooms ON classrooms.id = classroom_units.classroom_id
   INNER JOIN lms.classrooms_teachers ON classrooms_teachers.classroom_id = classrooms.id
   INNER JOIN lms.schools_users ON schools_users.user_id = classrooms_teachers.user_id
   INNER JOIN lms.schools ON schools.id = schools_users.school_id
  WHERE
    classrooms_teachers.role = 'owner'
    AND activity_sessions.completed_at IS NOT NULL
    AND activity_sessions.completed_at > '2021-07-31'
  GROUP BY
    student_id,
    activity_id,
    school_id,
    teacher_id,
    classroom_id,
    grade,
    completed_date
)
