        /*
           Data Processed By Query: 0.75 GB
           Bytes Billed For Query:  0.75 GB
           Total Query Time:        3101 ms
           Total Slot Time:         144680 ms
           BI Engine Mode Used:     BI_ENGINE_DISABLED
             BI Engine Code:          INPUT_TOO_LARGE
             BI Engine Message:       Cannot broadcast table lms.classrooms: number of files 293 > supported limit of 20.
        */
        SELECT value,
          IFNULL(SUM(count),0) AS count
          FROM (                SELECT activity_categories.name AS value, COUNT(DISTINCT unit_activities.id) * classroom_units.assigned_student_count AS count

                FROM lms.schools
        JOIN lms.schools_users
          ON schools.id = schools_users.school_id
        LEFT OUTER JOIN lms.classrooms_teachers
          ON schools_users.user_id = classrooms_teachers.user_id
        LEFT OUTER JOIN lms.classrooms
          ON classrooms_teachers.classroom_id = classrooms.id
        JOIN (SELECT created_at, classroom_id, unit_id, ARRAY_LENGTH(assigned_student_ids) AS assigned_student_count FROM lms.classroom_units) AS classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
        JOIN lms.activities
          ON unit_activities.activity_id = activities.id
        JOIN lms.activity_category_activities
          ON activities.id = activity_category_activities.activity_id
        JOIN lms.activity_categories
          ON activity_category_activities.activity_category_id = activity_categories.id

                WHERE
          classroom_units.created_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND schools.id IN (129038,11117,129037)
          
          
          
          AND classrooms_teachers.role = 'owner'

        GROUP BY activity_categories.name, classroom_units.assigned_student_count
        ORDER BY count DESC
        
)
          GROUP BY value
          ORDER BY count DESC
          LIMIT 10
