      /* Data Processed By Query: 2.39 GB */

                SELECT
          activity_sessions.id AS activity_session_id,
          MAX(activity_classifications.name) AS tool,
          MAX(classrooms_teachers.classroom_id) AS classroom_id,
          MAX(activity_sessions.completed_at) AS completed_at,
          MAX(activity_sessions.timespent) AS timespent,
          MAX(CASE WHEN activity_classifications.scored THEN activity_sessions.percentage ELSE -1 END) AS score,
          MAX(standards.name) AS standard,
          MAX(activity_sessions.user_id) AS student_id,
          MAX(activities.name) AS activity_name,
          MAX(units.name) AS activity_pack,
          MAX(users.name) AS teacher_name,
          MAX(students.name) AS student_name,
          MAX(students.email) AS student_email,
          MAX(schools.name) AS school_name,
          MAX(classrooms.name) AS classroom_name,
          MAX(classrooms.grade) AS classroom_grade

                FROM lms.schools
        JOIN lms.schools_users
          ON schools.id = schools_users.school_id
        LEFT OUTER JOIN lms.classrooms_teachers
          ON schools_users.user_id = classrooms_teachers.user_id
        LEFT OUTER JOIN lms.classrooms
          ON classrooms_teachers.classroom_id = classrooms.id
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN lms.activities
          ON activity_sessions.activity_id = activities.id
        JOIN lms.activity_classifications
          ON activities.activity_classification_id = activity_classifications.id
        LEFT OUTER JOIN lms.standards
          ON activities.standard_id = standards.id
        JOIN lms.users
          ON schools_users.user_id = users.id
        JOIN lms.units
          ON classroom_units.unit_id = units.id
        JOIN lms.users AS students
          ON activity_sessions.user_id = students.id

                WHERE
          activity_sessions.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND schools.id IN (129107,157509)
          
          
          
          AND classrooms_teachers.role = 'owner'

        GROUP BY activity_sessions.id
        ORDER BY completed_at DESC
        LIMIT 10
