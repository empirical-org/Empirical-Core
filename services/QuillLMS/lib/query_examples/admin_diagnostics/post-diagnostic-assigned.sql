        /*
           Data Processed By Query: 0.78 GB
           Bytes Billed For Query:  0.78 GB
           Total Query Time:        4245 ms
           Total Slot Time:         408814 ms
           BI Engine Mode Used:     BI_ENGINE_DISABLED
             BI Engine Code:          INPUT_TOO_LARGE
             BI Engine Message:       Cannot broadcast table lms.classrooms: number of files 241 > supported limit of 20.
        */
        WITH aggregate_rows AS (                SELECT
          activities.id AS diagnostic_id,
          activities.name AS diagnostic_name,
          classrooms.id AS aggregate_id,
          classrooms.name AS name,
          'classroom' AS group_by,
                    COUNT(DISTINCT CONCAT(classroom_units.id, ':', assigned_student_id)) AS post_students_assigned


                FROM lms.schools
        JOIN lms.schools_users
          ON schools.id = schools_users.school_id
        LEFT OUTER JOIN lms.classrooms_teachers
          ON schools_users.user_id = classrooms_teachers.user_id
        LEFT OUTER JOIN lms.classrooms
          ON classrooms_teachers.classroom_id = classrooms.id
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.users
          ON schools_users.user_id = users.id
        CROSS JOIN UNNEST(classroom_units.assigned_student_ids) AS assigned_student_id
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
        JOIN lms.activities AS post_activities
          ON unit_activities.activity_id = post_activities.id
        JOIN lms.activities
          ON post_activities.id = activities.follow_up_activity_id

                WHERE
          classroom_units.created_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND schools.id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          
          
          
          AND classrooms_teachers.role = 'owner'
          AND activities.id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)

        GROUP BY activities.id, activities.name, aggregate_id, classrooms.name
        
        
)
                SELECT
          diagnostic_id, diagnostic_name,
          NULL as aggregate_id,
          'ROLLUP' AS name,
          group_by,
          SUM(post_students_assigned) AS post_students_assigned
        FROM aggregate_rows
        GROUP BY diagnostic_id, diagnostic_name, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows

