        /*
           Data Processed By Query: 10.06 GB
           Bytes Billed For Query:  10.06 GB
           Total Query Time:        5833 ms
           Total Slot Time:         3813017 ms
           BI Engine Mode Used:     BI_ENGINE_DISABLED
             BI Engine Code:          UNSUPPORTED_SQL_TEXT
             BI Engine Message:       Observed 11 nested joins, BI Engine supports up to 10.
        */
        WITH aggregate_rows AS (                SELECT
          activities.id AS diagnostic_id,
          activities.name AS diagnostic_name,
          classrooms.id AS aggregate_id,
          classrooms.name AS name,
          'classroom' AS group_by,
                    COUNT(DISTINCT CONCAT(classrooms.id, ':', activity_sessions.user_id)) AS students_completed_practice,
          SAFE_DIVIDE(COUNT(DISTINCT activity_sessions.id), COUNT(DISTINCT CONCAT(classrooms.id, ':', activity_sessions.user_id))) AS average_practice_activities_count,
          SAFE_DIVIDE(SUM(activity_sessions.timespent), COUNT(DISTINCT CONCAT(classrooms.id, ':', activity_sessions.user_id))) AS average_time_spent_seconds


                FROM lms.schools
        JOIN lms.schools_users
          ON schools.id = schools_users.school_id
        LEFT OUTER JOIN lms.classrooms_teachers
          ON schools_users.user_id = classrooms_teachers.user_id
        LEFT OUTER JOIN lms.classrooms
          ON classrooms_teachers.classroom_id = classrooms.id
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.users
          ON schools_users.user_id = users.id
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
            AND activity_sessions.visible = true
        JOIN lms.units
          ON classroom_units.unit_id = units.id
        JOIN lms.recommendations
          ON units.unit_template_id = recommendations.unit_template_id
        JOIN lms.activities
          ON recommendations.activity_id = activities.id
        JOIN lms.activity_sessions AS pre_diagnostic_session
          ON activities.id = pre_diagnostic_session.activity_id
            AND activity_sessions.user_id = pre_diagnostic_session.user_id
            AND activity_sessions.completed_at > pre_diagnostic_session.completed_at
        JOIN lms.classroom_units AS pre_diagnostic_classroom_unit
          ON pre_diagnostic_session.classroom_unit_id = pre_diagnostic_classroom_unit.id
            AND classroom_units.classroom_id = pre_diagnostic_classroom_unit.classroom_id

                WHERE
          activity_sessions.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND schools.id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          
          
          
          AND classrooms_teachers.role = 'owner'
          AND activities.id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)

        GROUP BY activities.id, activities.name, aggregate_id, classrooms.name
        
        
)
                SELECT
          diagnostic_id, diagnostic_name,
          NULL as aggregate_id,
          'ROLLUP' AS name,
          group_by,
          SUM(students_completed_practice) AS students_completed_practice, SUM(students_completed_practice * average_practice_activities_count) / SUM(students_completed_practice) AS average_practice_activities_count, SUM(students_completed_practice * average_time_spent_seconds) / SUM(students_completed_practice) AS average_time_spent_seconds
        FROM aggregate_rows
        GROUP BY diagnostic_id, diagnostic_name, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows

