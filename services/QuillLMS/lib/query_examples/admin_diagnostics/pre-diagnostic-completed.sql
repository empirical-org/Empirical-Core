        /*
           Data Processed By Query: 20.92 GB
           Bytes Billed For Query:  20.92 GB
           Total Query Time:        5627 ms
           Total Slot Time:         5385229 ms
           BI Engine Mode Used:     BI_ENGINE_DISABLED
             BI Engine Code:          INPUT_TOO_LARGE
             BI Engine Message:       Input table special.concept_results has 5921 files, which exceeds the limit of 5000 files.
        */
        WITH aggregate_rows AS (        SELECT
            diagnostic_id,
            diagnostic_name,
            aggregate_id,
            name,
            group_by,
            COUNT(DISTINCT activity_session_id) AS pre_students_completed,
            SAFE_DIVIDE(SUM(CAST(optimal AS INT64)), CAST(COUNT(DISTINCT concept_result_id) AS FLOAT64)) AS pre_average_score
          FROM (                SELECT
          activities.id AS diagnostic_id,
          activities.name AS diagnostic_name,
          classrooms.id AS aggregate_id,
          classrooms.name AS name,
          'classroom' AS group_by,
                  activity_sessions.id AS activity_session_id,
        MAX(concept_results.correct) AS optimal,
        MAX(concept_results.id) AS concept_result_id


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
        JOIN special.concept_results
          ON activity_sessions.id = concept_results.activity_session_id
        JOIN lms.activities
          ON activity_sessions.activity_id = activities.id

                WHERE
          activity_sessions.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND schools.id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          
          
          
          AND classrooms_teachers.role = 'owner'
          AND activities.id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)

        GROUP BY activities.id, activities.name, aggregate_id, classrooms.name, activity_sessions.id, concept_results.question_number
        
        
)
          GROUP BY diagnostic_id, diagnostic_name, aggregate_id, name, group_by
)
                SELECT
          diagnostic_id, diagnostic_name,
          NULL as aggregate_id,
          'ROLLUP' AS name,
          group_by,
          SUM(pre_students_completed) AS pre_students_completed, SUM(pre_students_completed * pre_average_score) / SUM(pre_students_completed) AS pre_average_score
        FROM aggregate_rows
        GROUP BY diagnostic_id, diagnostic_name, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows

