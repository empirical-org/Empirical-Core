SELECT
    pre.assigned_at AS pre_assigned_at,
    pre.activity_session_id AS pre_activity_session_id,
    pre.activity_session_completed_at AS pre_activity_session_completed_at,
    post.activity_session_id AS post_activity_session_id,
    post.activity_session_completed_at AS post_activity_session_completed_at,
    pre.skill_group_id AS skill_group_id,
    pre.skill_group_name AS skill_group_name,
    pre.student_id AS student_id,
    pre.classroom_id AS classroom_id,
    pre.activity_id AS activity_id,
    pre.classroom_unit_id AS classroom_unit_id,
    activities.name AS activity_name,
    pre.questions_correct AS pre_questions_correct,
    pre.questions_total AS pre_questions_total,
    post.questions_correct AS post_questions_correct,
    post.questions_total AS post_questions_total
  FROM (
    SELECT
        classroom_units.created_at AS assigned_at,
        activity_sessions.id AS activity_session_id,
        activity_sessions.completed_at AS activity_session_completed_at,
        unit_activities.activity_id AS activity_id,
        skill_groups.id AS skill_group_id,
        skill_groups.name AS skill_group_name,
        COUNT(DISTINCT CASE WHEN concept_results.correct = true THEN concept_results.question_number ELSE NULL END) AS questions_correct,
        COUNT(DISTINCT concept_results.question_number) AS questions_total,
        classroom_units.classroom_id AS classroom_id,
        CAST(assigned_student_id AS int64) AS student_id,
        classroom_units.id AS classroom_unit_id
      FROM lms.classroom_units
      JOIN lms.unit_activities ON classroom_units.unit_id = unit_activities.unit_id
      CROSS JOIN UNNEST(classroom_units.assigned_student_ids) AS assigned_student_id
      LEFT OUTER JOIN (
        /* This sub-select is used to ensure that we only count the most recent completion from a student for a given activity in a given classroom */
        SELECT activity_sessions.*
          FROM (
            SELECT activity_sessions.user_id AS student_id, classroom_units.classroom_id, activity_sessions.activity_id, MAX(activity_sessions.completed_at) AS completed_at
              FROM lms.activity_sessions
              JOIN lms.classroom_units ON activity_sessions.classroom_unit_id = classroom_units.id
              GROUP BY activity_sessions.user_id, classroom_units.classroom_id, activity_sessions.activity_id
          ) AS most_recent
          JOIN lms.classroom_units ON most_recent.classroom_id = classroom_units.classroom_id
          JOIN lms.activity_sessions ON most_recent.student_id = activity_sessions.user_id
            AND classroom_units.id = activity_sessions.classroom_unit_id
            AND most_recent.activity_id = activity_sessions.activity_id
            AND most_recent.completed_at = activity_sessions.completed_at
      ) AS activity_sessions ON activity_sessions.classroom_unit_id = classroom_units.id AND activity_sessions.user_id = CAST(assigned_student_id AS int64) AND activity_sessions.visible = true
      LEFT OUTER JOIN special.concept_results AS concept_results          ON activity_sessions.id = concept_results.activity_session_id
      LEFT OUTER JOIN lms.questions ON STRING(PARSE_JSON(concept_results.extra_metadata).question_uid) = questions.uid
      LEFT OUTER JOIN lms.diagnostic_question_skills ON questions.id = diagnostic_question_skills.question_id
      LEFT OUTER JOIN lms.skill_group_activities ON activity_sessions.activity_id = skill_group_activities.activity_id
      LEFT OUTER JOIN lms.skill_groups
        ON diagnostic_question_skills.skill_group_id = skill_groups.id
      WHERE classroom_units.created_at BETWEEN '2023-07-01 00:00:00' AND '2024-02-16 23:59:59'
        AND unit_activities.activity_id IN (NULL, 1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
        AND classroom_units.visible = true
        AND (diagnostic_question_skills.skill_group_id = skill_group_activities.skill_group_id
          OR activity_sessions.id IS NULL)
      GROUP BY assigned_at,
        activity_session_id,
        activity_session_completed_at,
        activity_id,
        skill_group_id,
        skill_group_name,
        student_id,
        classroom_unit_id,
        classroom_id
  ) AS pre
  JOIN lms.activities ON pre.activity_id = activities.id
  LEFT OUTER JOIN (
    SELECT
        activity_sessions.id AS activity_session_id,
        activity_sessions.completed_at AS activity_session_completed_at,
        activity_sessions.activity_id AS activity_id,
        skill_groups.id AS skill_group_id,
        COUNT(CASE WHEN concept_results.correct = true THEN concept_results.question_number ELSE NULL END) AS questions_correct,
        COUNT(DISTINCT concept_results.question_number) AS questions_total,
        classroom_units.classroom_id AS classroom_id,
        activity_sessions.user_id AS student_id
      FROM (
        /* This sub-select is used to ensure that we only count the most recent completion from a student for a given activity in a given classroom */
        SELECT activity_sessions.*
          FROM (
            SELECT activity_sessions.user_id AS student_id, classroom_units.classroom_id, activity_sessions.activity_id, MAX(activity_sessions.completed_at) AS completed_at
              FROM lms.activity_sessions
              JOIN lms.classroom_units ON activity_sessions.classroom_unit_id = classroom_units.id
              GROUP BY activity_sessions.user_id, classroom_units.classroom_id, activity_sessions.activity_id
          ) AS most_recent
          JOIN lms.classroom_units ON most_recent.classroom_id = classroom_units.classroom_id
          JOIN lms.activity_sessions ON most_recent.student_id = activity_sessions.user_id
            AND classroom_units.id = activity_sessions.classroom_unit_id
            AND most_recent.activity_id = activity_sessions.activity_id
            AND most_recent.completed_at = activity_sessions.completed_at
      ) AS activity_sessions
      JOIN lms.classroom_units ON activity_sessions.classroom_unit_id = classroom_units.id
      JOIN special.concept_results AS concept_results          ON activity_sessions.id = concept_results.activity_session_id
      JOIN lms.questions ON STRING(PARSE_JSON(concept_results.extra_metadata).question_uid) = questions.uid
      JOIN lms.diagnostic_question_skills ON questions.id = diagnostic_question_skills.question_id
      JOIN lms.skill_group_activities ON activity_sessions.activity_id = skill_group_activities.activity_id
      JOIN lms.skill_groups
        ON diagnostic_question_skills.skill_group_id = skill_groups.id
          AND skill_group_activities.skill_group_id = skill_groups.id
      WHERE activity_sessions.completed_at BETWEEN '2023-07-01 00:00:00' AND '2024-02-16 23:59:59'
        AND activity_sessions.activity_id IN (1664, 1680, 1669, 1774, 1814, 1818)
        AND activity_sessions.visible = true
      GROUP BY activity_session_id,
        activity_session_completed_at,
        activity_id,
        skill_group_id,
        student_id,
        classroom_id
  ) AS post
    ON activities.follow_up_activity_id = post.activity_id
      AND pre.student_id = post.student_id
      AND pre.skill_group_id = post.skill_group_id
      AND pre.classroom_id = post.classroom_id
  WHERE pre.assigned_at BETWEEN '2023-07-01 00:00:00' AND '2024-02-16 23:59:59'
    AND pre.activity_id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
