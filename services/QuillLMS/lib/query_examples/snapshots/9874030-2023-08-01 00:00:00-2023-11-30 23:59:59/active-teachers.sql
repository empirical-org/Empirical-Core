      /* Data Processed By Query: 0.05 GB */

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
          AND schools.id IN (129107,157509)
          
          
          
          

        
        
        
