        /*
           Data Processed By Query: 83.43 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        0 ms
           Total Slot Time:          ms
           BI Engine Mode Used:     
             BI Engine Code:          
             BI Engine Message:       
        */
        WITH aggregate_rows AS (        SELECT
            diagnostic_id,
            diagnostic_name,
            aggregate_id,
            name,
            group_by,
            COUNT(DISTINCT activity_session_id) AS post_students_completed,
            SAFE_DIVIDE(SUM(CAST(optimal AS INT64)), CAST(COUNT(DISTINCT concept_result_id) AS FLOAT64)) AS post_average_score
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
        JOIN lms.activities AS post_activities
          ON activity_sessions.activity_id = post_activities.id
        JOIN lms.activities
          ON post_activities.id = activities.follow_up_activity_id

                WHERE
          activity_sessions.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
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
          SUM(post_students_completed) AS post_students_completed, SUM(post_students_completed * post_average_score) / SUM(post_students_completed) AS post_average_score
        FROM aggregate_rows
        GROUP BY diagnostic_id, diagnostic_name, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows

