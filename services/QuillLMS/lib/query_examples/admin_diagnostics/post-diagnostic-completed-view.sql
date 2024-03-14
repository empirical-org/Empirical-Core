        /*
           Data Processed By Query: 1.18 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        3363 ms
           Total Slot Time:         24874 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
        WITH aggregate_rows AS (        SELECT
            diagnostic_id,
            diagnostic_name,
            aggregate_id,
            name,
            group_by,
            post_students_completed,
            AVG(growth_percentage) AS overall_skill_growth
          FROM (                SELECT
          performance.activity_id AS diagnostic_id,
          activities.name AS diagnostic_name,
          classrooms.id AS aggregate_id,
          classrooms.name AS name,
          'classroom' AS group_by,
                  COUNT(DISTINCT performance.post_activity_session_id) AS post_students_completed,
        GREATEST(
         ROUND(SAFE_DIVIDE(SUM(performance.post_questions_correct), CAST(SUM(performance.post_questions_total) AS float64)), 2)
            - ROUND(SAFE_DIVIDE(SUM(CASE WHEN performance.post_activity_session_id IS NOT NULL THEN performance.pre_questions_correct ELSE NULL END),
              CAST(SUM(CASE WHEN performance.post_activity_session_id IS NOT NULL THEN performance.pre_questions_total ELSE NULL END) AS float64)), 2),
        0) AS growth_percentage


                FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.active_classroom_stubs_view AS classrooms ON performance.classroom_id = classrooms.id
        JOIN lms.classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.role = 'owner'
        JOIN lms.schools_users ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.activities ON performance.activity_id = activities.id
        JOIN lms.active_user_names_view AS users ON classrooms_teachers.user_id = users.id

                WHERE
          performance.pre_activity_session_completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          
          
          AND classrooms_teachers.role = 'owner'
          AND performance.activity_id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
          AND schools_users.school_id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          

        GROUP BY performance.activity_id, activities.name, aggregate_id, classrooms.name, performance.skill_group_name, performance.classroom_id
        
        
)
          GROUP BY diagnostic_id, diagnostic_name, aggregate_id, name, group_by, post_students_completed
)
                SELECT
          diagnostic_id, diagnostic_name,
          NULL as aggregate_id,
          'ROLLUP' AS name,
          group_by,
          SUM(post_students_completed) AS post_students_completed, SUM(post_students_completed * overall_skill_growth) / SUM(post_students_completed) AS overall_skill_growth
        FROM aggregate_rows
        GROUP BY diagnostic_id, diagnostic_name, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows

