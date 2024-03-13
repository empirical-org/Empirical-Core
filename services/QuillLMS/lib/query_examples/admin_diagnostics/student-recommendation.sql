        /*
           Data Processed By Query: 1.12 GB
           Bytes Billed For Query:  1.12 GB
           Total Query Time:        4430 ms
           Total Slot Time:         155348 ms
           BI Engine Mode Used:     BI_ENGINE_DISABLED
             BI Engine Code:          INPUT_TOO_LARGE
             BI Engine Message:       Cannot broadcast table lms.recommendation_activity_session_stubs_view: number of files 28 > supported limit of 20.
        */
        WITH aggregate_rows AS (                SELECT students.id AS student_id,
          COUNT(DISTINCT activity_sessions.id) AS completed_activities,
          SUM(activity_sessions.timespent) AS time_spent_seconds

                FROM lms.active_classroom_stubs_view AS classrooms
        JOIN lms.classrooms_teachers
          ON classrooms.id = classrooms_teachers.classroom_id
            AND classrooms_teachers.role = 'owner'
        JOIN lms.schools_users
          ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.active_classroom_unit_stubs_view AS classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.recommendation_activity_session_stubs_view AS activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN lms.units
          ON classroom_units.unit_id = units.id
        JOIN lms.recommendations
          ON units.unit_template_id = recommendations.unit_template_id
        JOIN lms.active_user_names_view AS students
          ON activity_sessions.user_id = students.id

                WHERE
          activity_sessions.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          
          
          AND classrooms_teachers.role = 'owner'
          AND recommendations.activity_id = 1663
          AND schools_users.school_id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          

        GROUP BY students.id, students.name
                ORDER BY TRIM(SUBSTR(TRIM(students.name), STRPOS(students.name, ' ') + 1))

                LIMIT 500

)
                SELECT *
          FROM aggregate_rows

