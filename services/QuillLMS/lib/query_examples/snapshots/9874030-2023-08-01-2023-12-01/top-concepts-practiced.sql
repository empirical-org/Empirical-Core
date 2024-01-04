      /* Data Processed By Query: 6.24 GB */

                SELECT activity_categories.name AS value, COUNT(DISTINCT activity_sessions.id) AS count

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
        JOIN lms.activity_category_activities
          ON activities.id = activity_category_activities.activity_id
        JOIN lms.activity_categories
          ON activity_category_activities.activity_category_id = activity_categories.id

                WHERE
          activity_sessions.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND schools.id IN (129107,157509)
          
          
          
          AND classrooms_teachers.role = 'owner'

        GROUP BY activity_categories.name
        ORDER BY count DESC
        LIMIT 10
