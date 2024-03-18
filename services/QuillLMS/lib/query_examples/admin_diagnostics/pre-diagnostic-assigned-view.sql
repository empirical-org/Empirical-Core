        /*
           Data Processed By Query: 1.54 GB
           Bytes Billed For Query:  1.54 GB
           Total Query Time:        1967 ms
           Total Slot Time:         134234 ms
           BI Engine Mode Used:     BI_ENGINE_DISABLED
             BI Engine Code:          INPUT_TOO_LARGE
             BI Engine Message:       Cannot broadcast table analytics-data-stores.lms.classrooms: number of files 247 > supported limit of 20.
        */
        WITH aggregate_rows AS (                SELECT
          performance.activity_id AS diagnostic_id,
          performance.activity_name AS diagnostic_name,
          filter.classroom_id AS aggregate_id,
          filter.classroom_name AS name,
          'classroom' AS group_by,
          COUNT(DISTINCT CONCAT(performance.pre_classroom_unit_id, ':', performance.student_id)) AS pre_students_assigned

                FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.school_classroom_teachers_view AS filter ON performance.classroom_id = filter.classroom_id

                WHERE
          performance.pre_assigned_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          
          
          AND performance.activity_id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
          AND filter.school_id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          

        GROUP BY performance.activity_id, performance.activity_name, aggregate_id, filter.classroom_name
        
        
)
                SELECT
          diagnostic_id, diagnostic_name,
          NULL as aggregate_id,
          'ROLLUP' AS name,
          group_by,
          SUM(pre_students_assigned) AS pre_students_assigned
        FROM aggregate_rows
        GROUP BY diagnostic_id, diagnostic_name, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows

