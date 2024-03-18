        /*
           Data Processed By Query: 1.5 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        2646 ms
           Total Slot Time:         17915 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
        WITH aggregate_rows AS (                SELECT
          skill_group_name,
          classrooms.id AS aggregate_id,
          classrooms.name AS name,
          'classroom' AS group_by,
                  COUNT(DISTINCT performance.pre_activity_session_id) AS pre_students_completed,
        COUNT(DISTINCT performance.post_activity_session_id) AS post_students_completed,
        ROUND(SAFE_DIVIDE(SUM(performance.pre_questions_correct), CAST(SUM(performance.pre_questions_total) AS float64)), 2) AS pre_score,
        ROUND(SAFE_DIVIDE(SUM(performance.post_questions_correct), CAST(SUM(performance.post_questions_total) AS float64)), 2) AS post_score,
        /*
        The value below is used to duplicate growth percentage calculations from teacher reports:
          It is intended to work only when aggregated at the Skill Group level
          The ROUND(..., 2) statements ensure that we aggregate at the same level of rounding as the teacher report uses (that report rounds all scores to integer percentages) which lets us avoid being off by 1% from the teacher reports because of higher precision
          The CASE statements ensure that we don't calculate the overall pre-Diagnostic performance, but rather calculate it only the performance for students who have also completed the post-Diagnostic
          NULL values are ignored when executing aggregate queries such as SUM, so rows from `performance` that have NULL "post" data will be excluded from the aggregation
          We subtract the pre-Diagnostic average from the post-Diagnostic average, and then use GREATEST to treat cases where post-Diagnostic scores are worse as if they were equal instead
        */
        GREATEST(
          ROUND(SAFE_DIVIDE(SUM(performance.post_questions_correct), CAST(SUM(performance.post_questions_total) AS float64)), 2)
            - ROUND(SAFE_DIVIDE(SUM(CASE WHEN performance.post_activity_session_id IS NOT NULL THEN performance.pre_questions_correct ELSE NULL END),
                CAST(SUM(CASE WHEN performance.post_activity_session_id IS NOT NULL THEN performance.pre_questions_total ELSE NULL END) AS float64)), 2),
        0) AS growth_percentage,
        COUNT(DISTINCT CASE WHEN (pre_questions_correct = pre_questions_total AND post_questions_correct = post_questions_total) THEN performance.student_id ELSE NULL END) AS maintained_proficiency,
        COUNT(DISTINCT CASE WHEN (pre_questions_correct < pre_questions_total AND post_questions_correct > pre_questions_correct) THEN performance.student_id ELSE NULL END) AS improved_proficiency,
        COUNT(DISTINCT CASE WHEN (post_questions_correct < pre_questions_correct OR (pre_questions_correct < pre_questions_total AND post_questions_correct = pre_questions_correct)) THEN performance.student_id ELSE NULL END) AS recommended_practice


                FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.active_classroom_stubs_view AS classrooms ON performance.classroom_id = classrooms.id
        JOIN lms.classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.role = 'owner'
        JOIN lms.schools_users ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.activities ON performance.activity_id = activities.id
        JOIN lms.active_user_names_view AS users ON classrooms_teachers.user_id = users.id

                WHERE
          performance.pre_activity_session_completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          
          
          AND classrooms_teachers.role = 'owner'
          AND activities.id = 1663
          AND schools_users.school_id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          

        GROUP BY aggregate_id, classrooms.name, skill_group_name
        
        
)
                SELECT
          skill_group_name,
          NULL as aggregate_id,
          'ROLLUP' AS name,
          group_by,
          SUM(pre_students_completed) AS pre_students_completed, SUM(post_students_completed) AS post_students_completed, SUM(pre_students_completed * pre_score) / SUM(pre_students_completed) AS pre_score, SUM(post_students_completed * post_score) / SUM(post_students_completed) AS post_score, SUM(post_students_completed * growth_percentage) / SUM(post_students_completed) AS growth_percentage, SUM(maintained_proficiency) AS maintained_proficiency, SUM(improved_proficiency) AS improved_proficiency, SUM(recommended_practice) AS recommended_practice
        FROM aggregate_rows
        GROUP BY skill_group_name, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows

