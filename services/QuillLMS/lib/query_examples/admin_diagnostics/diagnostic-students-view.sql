        /*
           Data Processed By Query: 1.5 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        7521 ms
           Total Slot Time:         113397 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
        WITH aggregate_rows AS (                SELECT
          students.id AS student_id,
          students.name AS student_name,
          performance.pre_activity_session_completed_at,
          performance.post_activity_session_completed_at,
          performance.classroom_id,
          CONCAT(classrooms.id, ':', students.id) AS aggregate_id,
          students.name AS name,
          'student' AS group_by,
          performance.skill_group_name AS skill_group_name,
                  CASE WHEN performance.pre_questions_correct < performance.post_questions_correct THEN 1 ELSE 0 END AS pre_to_post_improved_skill_count,
        performance.pre_questions_correct AS pre_questions_correct,
        performance.pre_questions_total AS pre_questions_total,
        SAFE_DIVIDE(CAST(performance.pre_questions_correct AS float64), performance.pre_questions_total) AS pre_questions_percentage,
        performance.post_questions_correct AS post_questions_correct,
        performance.post_questions_total AS post_questions_total,
        SAFE_DIVIDE(CAST(performance.post_questions_correct AS float64), performance.post_questions_total) AS post_questions_percentage,
        1 AS total_skills,
        CASE WHEN performance.pre_questions_correct = performance.pre_questions_total THEN 1 ELSE 0 END AS pre_skills_proficient,
        CASE WHEN performance.pre_questions_correct = performance.pre_questions_total THEN 0 ELSE 1 END AS pre_skills_to_practice,
        CASE WHEN performance.post_questions_correct < performance.post_questions_total AND performance.post_questions_correct <= performance.pre_questions_correct THEN 1 ELSE 0 END post_skills_to_practice,
        CASE WHEN performance.post_questions_correct > performance.pre_questions_correct THEN 1 ELSE 0 END AS post_skills_improved,
        CASE WHEN performance.post_questions_correct = performance.pre_questions_correct AND performance.post_questions_correct = performance.post_questions_total THEN 1 ELSE 0 END post_skills_maintained,
        CASE WHEN performance.post_questions_correct > performance.pre_questions_correct OR (performance.post_questions_correct = performance.pre_questions_correct AND performance.post_questions_correct = performance.post_questions_total) THEN 1 ELSE 0 END post_skills_improved_or_maintained


                        FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.active_classroom_stubs_view AS classrooms ON performance.classroom_id = classrooms.id
        JOIN lms.classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.role = 'owner'
        JOIN lms.schools_users ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.activities ON performance.activity_id = activities.id
        JOIN lms.active_user_names_view AS users ON classrooms_teachers.user_id = users.id

        JOIN lms.active_user_names_view AS students ON performance.student_id = students.id

                WHERE
          performance.pre_assigned_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          
          
          AND classrooms_teachers.role = 'owner'
          AND performance.activity_id = 1663
          AND schools_users.school_id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          

              GROUP BY skill_group_name,
        aggregate_id,
        students.name,
        student_id,
        pre_activity_session_completed_at,
        post_activity_session_completed_at,
        performance.classroom_id,
        performance.pre_questions_correct,
        performance.pre_questions_total,
        performance.post_questions_correct,
        performance.post_questions_total

                ORDER BY TRIM(SUBSTR(TRIM(student_name), STRPOS(student_name, ' ') + 1)), student_name, student_id, skill_group_name

                LIMIT 5000

)
                SELECT
          student_id, student_name, pre_activity_session_completed_at, post_activity_session_completed_at, classroom_id,
          NULL as aggregate_id,
          'ROLLUP' AS name,
          group_by,
          'ROLLUP' AS skill_group_name, SUM(pre_to_post_improved_skill_count) AS pre_to_post_improved_skill_count, SUM(pre_questions_correct) AS pre_questions_correct, SUM(pre_questions_total) AS pre_questions_total, AVG(pre_questions_percentage) AS pre_questions_percentage, SUM(post_questions_correct) AS post_questions_correct, SUM(post_questions_total) AS post_questions_total, AVG(post_questions_percentage) AS post_questions_percentage, SUM(total_skills) AS total_skills, SUM(pre_skills_proficient) AS pre_skills_proficient, SUM(pre_skills_to_practice) AS pre_skills_to_practice, SUM(post_skills_to_practice) AS post_skills_to_practice, SUM(post_skills_improved) AS post_skills_improved, SUM(post_skills_maintained) AS post_skills_maintained, SUM(post_skills_improved_or_maintained) AS post_skills_improved_or_maintained
        FROM aggregate_rows
        GROUP BY student_id, student_name, pre_activity_session_completed_at, post_activity_session_completed_at, classroom_id, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows

