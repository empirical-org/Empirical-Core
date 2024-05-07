        /*
           Data Processed By Query: 1.77 GB
           Bytes Billed For Query:  0.24 GB
           Total Query Time:        2520 ms
           Total Slot Time:         2147 ms
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
            CAST(SUM(post_students_completed) / COUNT(DISTINCT skill_group_id) AS int64) AS post_students_completed,
            AVG(growth_percentage) AS overall_skill_growth
          FROM (                SELECT
          performance.activity_id AS diagnostic_id,
          performance.activity_name AS diagnostic_name,
          filter.classroom_id AS aggregate_id,
          filter.classroom_name AS name,
          'classroom' AS group_by,
                  performance.skill_group_id,
        COUNT(DISTINCT performance.post_activity_session_id) AS post_students_completed,
        GREATEST(
          SAFE_DIVIDE(SUM(performance.post_questions_correct), CAST(SUM(performance.post_questions_total) AS float64))
            - SAFE_DIVIDE(SUM(CASE WHEN performance.post_activity_session_id IS NOT NULL THEN performance.pre_questions_correct ELSE NULL END), CAST(SUM(CASE WHEN performance.post_activity_session_id IS NOT NULL THEN performance.pre_questions_total ELSE NULL END) AS float64)
          ),
        0) AS growth_percentage


                FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.school_classroom_teachers_view AS filter ON performance.classroom_id = filter.classroom_id

                WHERE
          performance.pre_activity_session_completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          
          
          AND performance.activity_id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
          AND filter.school_id IN (129038,11117,129037)
          

        GROUP BY performance.activity_id, performance.activity_name, aggregate_id, filter.classroom_name, performance.skill_group_id, performance.classroom_id
        
        
)
          GROUP BY diagnostic_id, diagnostic_name, aggregate_id, name, group_by
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

