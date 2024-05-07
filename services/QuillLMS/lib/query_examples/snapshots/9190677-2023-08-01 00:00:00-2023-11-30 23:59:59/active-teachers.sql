        /*
           Data Processed By Query: 0.06 GB
           Bytes Billed For Query:  0.06 GB
           Total Query Time:        2473 ms
           Total Slot Time:         17086 ms
           BI Engine Mode Used:     BI_ENGINE_DISABLED
             BI Engine Code:          INPUT_TOO_LARGE
             BI Engine Message:       Cannot broadcast table lms.classrooms: number of files 293 > supported limit of 20.
        */
        SELECT COUNT(DISTINCT schools_users.user_id) AS count
                FROM lms.schools
        JOIN lms.schools_users
          ON schools.id = schools_users.school_id
        LEFT OUTER JOIN lms.classrooms_teachers
          ON schools_users.user_id = classrooms_teachers.user_id
        LEFT OUTER JOIN lms.classrooms
          ON classrooms_teachers.classroom_id = classrooms.id
        JOIN lms.user_logins
          ON schools_users.user_id = user_logins.user_id

                WHERE
          user_logins.created_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND schools.id IN (129038,11117,129037)
          
          
          
          

        
        
        
