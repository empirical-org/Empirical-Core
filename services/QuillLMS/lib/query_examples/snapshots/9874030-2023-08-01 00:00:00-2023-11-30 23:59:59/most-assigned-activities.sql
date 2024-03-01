      /* Data Processed By Query: 0.69 GB */

        SELECT value,
          IFNULL(SUM(count),0) AS count
          FROM (                SELECT activities.name AS value, COUNT(DISTINCT unit_activities.id) * classroom_units.assigned_student_count AS count

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

                WHERE
          classroom_units.created_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND schools.id IN (129107,157509)
          
          
          
          AND classrooms_teachers.role = 'owner'

        GROUP BY activities.name, classroom_units.assigned_student_count
        ORDER BY count DESC
        
)
          GROUP BY value
          ORDER BY count DESC
          LIMIT 10
