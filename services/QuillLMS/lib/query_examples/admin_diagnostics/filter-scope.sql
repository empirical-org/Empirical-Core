        /*
           Data Processed By Query: 0.56 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        1423 ms
           Total Slot Time:         6276 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
        SELECT COUNT(DISTINCT student_id) AS count
                FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.active_classroom_stubs_view AS classrooms ON performance.classroom_id = classrooms.id
        JOIN lms.classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.role = 'owner'
        JOIN lms.schools_users ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.schools ON schools_users.school_id = schools.id

                WHERE performance.pre_assigned_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          
          
          AND classrooms_teachers.role = 'owner'
          AND performance.activity_id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
          AND schools_users.school_id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          
          AND performance.activity_id = 1663

        
        
        
