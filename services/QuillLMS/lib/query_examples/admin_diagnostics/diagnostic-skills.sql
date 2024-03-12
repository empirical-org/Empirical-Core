        /*
           Data Processed By Query: 167.65 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        0 ms
           Total Slot Time:          ms
           BI Engine Mode Used:     
             BI Engine Code:          
             BI Engine Message:       
        */
        WITH most_recent_activity_sessions AS (                SELECT
          classrooms.id AS aggregate_id,
          classrooms.name AS name,
          'classroom' AS group_by,
                  students.id AS student_id,
        MAX(pre_activity_sessions.id) AS pre_activity_session_id,
        MAX(post_activity_sessions.id) AS post_activity_session_id


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
        JOIN lms.activity_sessions AS pre_activity_sessions
          ON classroom_units.id = pre_activity_sessions.classroom_unit_id
        JOIN lms.activities
          ON pre_activity_sessions.activity_id = activities.id
        JOIN lms.users AS students
          ON pre_activity_sessions.user_id = students.id
        LEFT OUTER JOIN lms.activity_sessions AS post_activity_sessions
          ON activities.follow_up_activity_id = post_activity_sessions.activity_id
            AND pre_activity_sessions.user_id = post_activity_sessions.user_id
            AND pre_activity_sessions.completed_at < post_activity_sessions.completed_at

                WHERE
          pre_activity_sessions.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND schools.id IN (38811,38804,38801,38800,38779,38784,38780,38773,38765,38764)
          
          
          
          AND classrooms_teachers.role = 'owner'
          AND activities.id = 1663

        GROUP BY aggregate_id, classrooms.name, student_id
        
        
),
pre_questions_correct AS (        SELECT
          student_id,
          pre_activity_session_id,
          post_activity_session_id,
          MAX(STRING(PARSE_JSON(pre_concept_results.extra_metadata).question_uid)) AS pre_question_uid,
          MAX(CAST(pre_concept_results.correct AS INT64)) AS pre_correct,
          most_recent_activity_sessions.aggregate_id,
          most_recent_activity_sessions.name,
          most_recent_activity_sessions.group_by
        FROM most_recent_activity_sessions
        JOIN special.concept_results AS pre_concept_results
          ON most_recent_activity_sessions.pre_activity_session_id = pre_concept_results.activity_session_id
        GROUP BY student_id, pre_activity_session_id, post_activity_session_id, pre_concept_results.question_number, aggregate_id, name, group_by
),
pre_skill_scores AS (        SELECT
          pre_questions_correct.student_id,
          pre_questions_correct.pre_activity_session_id,
          pre_questions_correct.post_activity_session_id,
          pre_skill_groups.name AS skill_name,
          COUNT(DISTINCT(CASE pre_correct WHEN 1 THEN pre_question_uid ELSE NULL END)) AS pre_correct_total,
          COUNT(DISTINCT pre_question_uid) AS pre_total_questions,
          pre_questions_correct.aggregate_id,
          pre_questions_correct.name,
          pre_questions_correct.group_by
        FROM pre_questions_correct
        JOIN lms.questions AS pre_questions
          ON pre_questions_correct.pre_question_uid = pre_questions.uid
        JOIN lms.diagnostic_question_skills AS pre_diagnostic_question_skills
          ON pre_questions.id = pre_diagnostic_question_skills.question_id
        JOIN lms.skill_groups AS pre_skill_groups
          ON pre_diagnostic_question_skills.skill_group_id = pre_skill_groups.id
        GROUP BY student_id, pre_activity_session_id, post_activity_session_id, pre_skill_groups.name, aggregate_id, name, group_by
),
post_questions_correct AS (        SELECT
          student_id,
          pre_activity_session_id,
          post_activity_session_id,
          MAX(STRING(PARSE_JSON(post_concept_results.extra_metadata).question_uid)) AS post_question_uid,
          MAX(CAST(post_concept_results.correct AS INT64)) AS post_correct,
          most_recent_activity_sessions.aggregate_id,
          most_recent_activity_sessions.name,
          most_recent_activity_sessions.group_by
        FROM most_recent_activity_sessions
        JOIN special.concept_results AS post_concept_results
          ON most_recent_activity_sessions.post_activity_session_id = post_concept_results.activity_session_id
        GROUP BY student_id, pre_activity_session_id, post_activity_session_id, post_concept_results.question_number, aggregate_id, name, group_by
),
post_skill_scores AS (        SELECT
          post_questions_correct.student_id,
          post_questions_correct.pre_activity_session_id,
          post_questions_correct.post_activity_session_id,
          post_skill_groups.name AS skill_name,
          COUNT(DISTINCT(CASE post_correct WHEN 1 THEN post_question_uid ELSE NULL END)) AS post_correct_total,
          COUNT(DISTINCT post_question_uid) AS post_total_questions,
          post_questions_correct.aggregate_id,
          post_questions_correct.name,
          post_questions_correct.group_by
        FROM post_questions_correct
        JOIN lms.questions AS post_questions
          ON post_questions_correct.post_question_uid = post_questions.uid
        JOIN lms.diagnostic_question_skills AS post_diagnostic_question_skills
          ON post_questions.id = post_diagnostic_question_skills.question_id
        JOIN lms.skill_groups AS post_skill_groups
          ON post_diagnostic_question_skills.skill_group_id = post_skill_groups.id
        GROUP BY student_id, pre_activity_session_id, post_activity_session_id, post_skill_groups.name, aggregate_id, name, group_by
),
with_improvement AS (        SELECT
          most_recent_activity_sessions.student_id,
          most_recent_activity_sessions.pre_activity_session_id,
          most_recent_activity_sessions.post_activity_session_id,
          pre_skill_scores.skill_name,
          most_recent_activity_sessions.aggregate_id,
          most_recent_activity_sessions.name,
          most_recent_activity_sessions.group_by,
          COUNT(DISTINCT CASE WHEN
            (pre_correct_total = pre_total_questions
              AND post_correct_total = post_total_questions
            ) THEN post_skill_scores.student_id ELSE NULL END) AS maintained_proficiency,
          COUNT(DISTINCT CASE WHEN
            (pre_correct_total < pre_total_questions
              AND post_correct_total > pre_correct_total
            ) THEN post_skill_scores.student_id ELSE NULL END) AS improved_proficiency,
          COUNT(DISTINCT CASE WHEN
            (post_correct_total < pre_correct_total
             OR (pre_correct_total < pre_total_questions
              AND post_correct_total = pre_correct_total)
            ) THEN post_skill_scores.student_id ELSE NULL END) AS recommended_practice
        FROM most_recent_activity_sessions
        JOIN pre_skill_scores
          ON most_recent_activity_sessions.pre_activity_session_id = pre_skill_scores.pre_activity_session_id
        LEFT OUTER JOIN post_skill_scores
          ON most_recent_activity_sessions.post_activity_session_id = post_skill_scores.post_activity_session_id
            AND pre_skill_scores.skill_name = post_skill_scores.skill_name
        GROUP BY most_recent_activity_sessions.student_id, most_recent_activity_sessions.pre_activity_session_id, most_recent_activity_sessions.post_activity_session_id, pre_skill_scores.skill_name, aggregate_id, name, group_by
),
aggregate_rows AS (        SELECT
          pre_skill_scores.skill_name,
          with_improvement.aggregate_id,
          with_improvement.name,
          with_improvement.group_by,
          SUM(pre_correct_total) / SUM(pre_total_questions) * 100 AS pre_score, SUM(post_correct_total) / SUM(post_total_questions) * 100 AS post_score, SUM(pre_correct_total) AS pre_correct_total, SUM(pre_total_questions) AS pre_total_questions, SUM(post_correct_total) AS post_correct_total, SUM(post_total_questions) AS post_total_questions, SUM(maintained_proficiency) AS maintained_proficiency, SUM(improved_proficiency) AS improved_proficiency, SUM(recommended_practice) AS recommended_practice
        FROM most_recent_activity_sessions
        JOIN pre_skill_scores
          ON most_recent_activity_sessions.pre_activity_session_id = pre_skill_scores.pre_activity_session_id
        LEFT OUTER JOIN post_skill_scores
          ON most_recent_activity_sessions.post_activity_session_id = post_skill_scores.post_activity_session_id
            AND pre_skill_scores.skill_name = post_skill_scores.skill_name
        LEFT OUTER JOIN with_improvement
          ON most_recent_activity_sessions.student_id = with_improvement.student_id AND pre_skill_scores.skill_name = with_improvement.skill_name
        GROUP BY aggregate_id, name, skill_name, group_by
)
                SELECT
          skill_name,
          NULL as aggregate_id,
          'ROLLUP' AS name,
          group_by,
          SUM(pre_correct_total) / SUM(pre_total_questions) * 100 AS pre_score, SUM(post_correct_total) / SUM(post_total_questions) * 100 AS post_score, SUM(pre_correct_total) AS pre_correct_total, SUM(pre_total_questions) AS pre_total_questions, SUM(post_correct_total) AS post_correct_total, SUM(post_total_questions) AS post_total_questions, SUM(maintained_proficiency) AS maintained_proficiency, SUM(improved_proficiency) AS improved_proficiency, SUM(recommended_practice) AS recommended_practice
        FROM aggregate_rows
        GROUP BY skill_name, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows

