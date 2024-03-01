      /* Data Processed By Query: 6.83 GB */

        SELECT COUNTIF(activities_completed = activities_in_pack) AS count
          FROM (        SELECT classroom_units.id, activity_sessions.user_id, COUNT(DISTINCT activity_sessions.activity_id) AS activities_completed, COUNT(DISTINCT unit_activities.activity_id) AS activities_in_pack
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
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id

                WHERE
          activity_sessions.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND schools.id IN (129107,157509)
          
          
          
          AND classrooms_teachers.role = 'owner'

        GROUP BY classroom_units.id, activity_sessions.user_id
        
        
)
