      /* Data Processed By Query: 0.5 GB */

        SELECT IFNULL(SUM(students_assigned), 0) AS count
          FROM (        SELECT DISTINCT classroom_units.id, ARRAY_LENGTH(assigned_student_ids) AS students_assigned
                FROM lms.schools
        JOIN lms.schools_users
          ON schools.id = schools_users.school_id
        LEFT OUTER JOIN lms.classrooms_teachers
          ON schools_users.user_id = classrooms_teachers.user_id
        LEFT OUTER JOIN lms.classrooms
          ON classrooms_teachers.classroom_id = classrooms.id
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id

                WHERE
          classroom_units.created_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND schools.id IN (129107,157509)
          
          
          
          AND classrooms_teachers.role = 'owner'
        AND unit_activities.activity_id IN (1663,1668,1678,1161,1568,1590)

        
        
        
)
