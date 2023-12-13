      /* Data Process By Query: 0.18 GB */

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
        JOIN lms.user_logins
          ON users.id = user_logins.user_id

                WHERE
          user_logins.created_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND schools.id IN (129107,157509)
          
          
          
          

        
        
        
