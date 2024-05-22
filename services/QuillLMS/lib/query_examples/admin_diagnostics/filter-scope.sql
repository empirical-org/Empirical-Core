        /*
           Data Processed By Query: 0.67 GB
           Bytes Billed For Query:  0.13 GB
           Total Query Time:        792 ms
           Total Slot Time:         1635 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
        SELECT COUNT(DISTINCT CONCAT(performance.classroom_id, ':', performance.student_id)) AS count
                FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.school_classroom_teachers_view AS filter ON performance.classroom_id = filter.classroom_id

                WHERE performance.pre_assigned_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          
          
          AND performance.activity_id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
          AND filter.school_id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          
          AND performance.activity_id = 1663

        
        
        
