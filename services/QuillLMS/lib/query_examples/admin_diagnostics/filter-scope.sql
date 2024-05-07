        /*
           Data Processed By Query: 0.68 GB
           Bytes Billed For Query:  0.14 GB
           Total Query Time:        909 ms
           Total Slot Time:         527 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
        SELECT COUNT(DISTINCT CONCAT(performance.classroom_id, ':', performance.student_id)) AS count
                FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.school_classroom_teachers_view AS filter ON performance.classroom_id = filter.classroom_id

                WHERE performance.pre_assigned_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          
          
          AND performance.activity_id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
          AND filter.school_id IN (129038,11117,129037)
          
          AND performance.activity_id = 1663

        
        
        
