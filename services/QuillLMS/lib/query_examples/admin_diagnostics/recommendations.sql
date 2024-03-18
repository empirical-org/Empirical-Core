        /*
           Data Processed By Query: 0.12 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        811 ms
           Total Slot Time:         505 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
        WITH aggregate_rows AS (                SELECT
          activity_id AS diagnostic_id,
          activity_name AS diagnostic_name,
          classroom_id AS aggregate_id,
          classroom_name AS name,
          'classroom' AS group_by,
                    COUNT(DISTINCT CONCAT(classroom_id, ':', user_id)) AS students_completed_practice,
          SAFE_DIVIDE(SUM(completed_activities), COUNT(DISTINCT CONCAT(classroom_id, ':', user_id))) AS average_practice_activities_count,
          SAFE_DIVIDE(SUM(time_spent_seconds), COUNT(DISTINCT CONCAT(classroom_id, ':', user_id))) AS average_time_spent_seconds


                FROM lms.recommendation_count_rollup_view

                WHERE
          pre_diagnostic_completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          
          
          AND activity_id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
          AND school_id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          

        GROUP BY activity_id, activity_name, aggregate_id, classroom_name
        
        
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

