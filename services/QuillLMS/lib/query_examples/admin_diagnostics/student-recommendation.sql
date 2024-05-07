        /*
           Data Processed By Query: 0.23 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        1551 ms
           Total Slot Time:         451 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
                SELECT user_id AS student_id,
          completed_activities,
          time_spent_seconds

                FROM lms.recommendation_count_rollup_view
        JOIN lms.active_user_names_view AS students
          ON recommendation_count_rollup_view.user_id = students.id

                        WHERE
          pre_diagnostic_completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          
          
          AND activity_id = 1663
          AND school_id IN (129038,11117,129037)
          

        AND activity_id = 1663

        
        ORDER BY TRIM(SUBSTR(TRIM(students.name), STRPOS(students.name, ' ') + 1))
        LIMIT 500
