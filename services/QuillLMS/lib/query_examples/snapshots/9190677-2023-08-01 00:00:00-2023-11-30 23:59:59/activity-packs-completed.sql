        /*
           Data Processed By Query: 7.18 GB
           Bytes Billed For Query:  7.18 GB
           Total Query Time:        4016 ms
           Total Slot Time:         438975 ms
           BI Engine Mode Used:     BI_ENGINE_DISABLED
             BI Engine Code:          INPUT_TOO_LARGE
             BI Engine Message:       Cannot broadcast table lms.classrooms: number of files 293 > supported limit of 20.
        */
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
          AND schools.id IN (129038,11117,129037)
          
          
          
          AND classrooms_teachers.role = 'owner'

        GROUP BY classroom_units.id, activity_sessions.user_id
        
        
)
