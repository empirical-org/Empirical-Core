        /*
           Data Processed By Query: 1.7 GB
           Bytes Billed For Query:  0.23 GB
           Total Query Time:        1874 ms
           Total Slot Time:         6010 ms
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
            COUNT(DISTINCT activity_session_id) AS pre_students_completed,
            SAFE_DIVIDE(SUM(pre_questions_correct), CAST(SUM(pre_questions_total) AS FLOAT64)) AS pre_average_score
          FROM (                SELECT
          performance.activity_id AS diagnostic_id,
          performance.activity_name AS diagnostic_name,
          filter.classroom_id AS aggregate_id,
          filter.classroom_name AS name,
          'classroom' AS group_by,
                  performance.pre_activity_session_id AS activity_session_id,
        SUM(performance.pre_questions_correct) AS pre_questions_correct,
        SUM(performance.pre_questions_total) AS pre_questions_total


                FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.school_classroom_teachers_view AS filter ON performance.classroom_id = filter.classroom_id

                WHERE
          performance.pre_activity_session_completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          
          
          AND performance.activity_id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
          AND filter.school_id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          

        GROUP BY performance.activity_id, performance.activity_name, aggregate_id, filter.classroom_name, activity_session_id
        
        
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

