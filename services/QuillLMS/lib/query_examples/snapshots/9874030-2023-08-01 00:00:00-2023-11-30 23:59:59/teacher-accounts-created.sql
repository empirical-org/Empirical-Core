      /* Data Processed By Query: 0.09 GB */

        SELECT COUNT(DISTINCT users.id) AS count
                FROM lms.schools
        JOIN lms.schools_users
          ON schools.id = schools_users.school_id
        LEFT OUTER JOIN lms.classrooms_teachers
          ON schools_users.user_id = classrooms_teachers.user_id
        LEFT OUTER JOIN lms.classrooms
          ON classrooms_teachers.classroom_id = classrooms.id
        JOIN lms.users
          ON schools_users.user_id = users.id

                WHERE
          users.created_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND schools.id IN (129107,157509)
          
          
          
          

        
        
        
