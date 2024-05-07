        /*
           Data Processed By Query: 0.4 GB
           Bytes Billed For Query:  0.4 GB
           Total Query Time:        1350 ms
           Total Slot Time:         60599 ms
           BI Engine Mode Used:     BI_ENGINE_DISABLED
             BI Engine Code:          INPUT_TOO_LARGE
             BI Engine Message:       Cannot broadcast table lms.classrooms: number of files 293 > supported limit of 20.
        */
        SELECT IFNULL(SUM(assigned_count), 0) AS count
          FROM (        SELECT DISTINCT classroom_units.id, ARRAY_LENGTH(classroom_units.assigned_student_ids) AS assigned_count
                FROM lms.schools
        JOIN lms.schools_users
          ON schools.id = schools_users.school_id
        LEFT OUTER JOIN lms.classrooms_teachers
          ON schools_users.user_id = classrooms_teachers.user_id
        LEFT OUTER JOIN lms.classrooms
          ON classrooms_teachers.classroom_id = classrooms.id
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id

                WHERE
          classroom_units.created_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND schools.id IN (129038,11117,129037)
          
          
          
          AND classrooms_teachers.role = 'owner'

        
        
        
)
