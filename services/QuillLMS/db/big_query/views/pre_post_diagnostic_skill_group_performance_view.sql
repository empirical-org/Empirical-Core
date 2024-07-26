SELECT
    pre.assigned_at AS pre_assigned_at,
    post.assigned_at AS post_assigned_at,
    pre.activity_session_id AS pre_activity_session_id,
    pre.activity_session_completed_at AS pre_activity_session_completed_at,
    post.activity_session_id AS post_activity_session_id,
    post.activity_session_completed_at AS post_activity_session_completed_at,
    IFNULL(pre.skill_group_id, post.skill_group_id) AS skill_group_id,
    IFNULL(pre.skill_group_name, post.skill_group_name) AS skill_group_name,
    IFNULL(pre.student_id, post.student_id) AS student_id,
    IFNULL(pre.classroom_id, post.classroom_id) AS classroom_id,
    IFNULL(pre.activity_id, post.pre_activity_id) AS activity_id,
    pre.classroom_unit_id AS pre_classroom_unit_id,
    post.classroom_unit_id AS post_classroom_unit_id,
    IFNULL(pre.activity_name, post.pre_activity_name) AS activity_name,
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
        activities.name AS activity_name,
        activities.follow_up_activity_id AS post_activity_id,
        skill_groups.id AS skill_group_id,
        skill_groups.name AS skill_group_name,
        SUM(CAST(question_scores.correct AS int64)) AS questions_correct,
        COUNT(DISTINCT question_scores.question_number) AS questions_total,
        classroom_units.classroom_id AS classroom_id,
        CAST(assigned_student_id AS int64) AS student_id,
        classroom_units.id AS classroom_unit_id
      FROM lms.classroom_units
      JOIN lms.unit_activities ON classroom_units.unit_id = unit_activities.unit_id
      JOIN lms.activities ON unit_activities.activity_id = activities.id
      CROSS JOIN UNNEST(JSON_VALUE_ARRAY(classroom_units.assigned_student_ids)) AS assigned_student_id
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
      ) AS activity_sessions ON activity_sessions.classroom_unit_id = classroom_units.id AND activity_sessions.user_id = CAST(assigned_student_id AS int64) AND activity_sessions.activity_id = activities.id AND activity_sessions.visible = true
      LEFT OUTER JOIN (
        SELECT
            concept_results.activity_session_id,
            STRING(PARSE_JSON(concept_results.extra_metadata).question_uid) AS question_uid,
            concept_results.question_number,
            /*
              Old diagnostics use a more complicated way of scoring questions than new ones
              Some old style diagnostics have multiple concepts that they test for, and thus need to account for cases where there are multiple ConceptResults for a single answer, but only some of them count toward whether or not the question as a whole counts as "correct" or not
              New style diagnostics expect to always have only one ConceptResult for each student response, so we're effectively expecting to be doing LOGICAL_AND on a set of one item for each of them
            */
            CASE WHEN activity_sessions.activity_id IN (1663,1668,1678,1161,1568,1590,992,1229,1230,1432)
              THEN (
                COUNT(diagnostic_question_optimal_concepts.id) > 0 AND
                LOGICAL_AND(CASE WHEN diagnostic_question_optimal_concepts.id IS NOT NULL THEN concept_results.correct END)
              )
              ELSE LOGICAL_AND(concept_results.correct)
            END AS correct
          FROM lms.concept_results AS concept_results
          JOIN lms.activity_sessions ON concept_results.activity_session_id = activity_sessions.id
          LEFT OUTER JOIN lms.diagnostic_question_optimal_concepts ON STRING(PARSE_JSON(concept_results.extra_metadata).question_uid) = diagnostic_question_optimal_concepts.question_uid AND concept_results.concept_id = diagnostic_question_optimal_concepts.concept_id
          WHERE concept_results.attempt_number IS NULL
          GROUP BY activity_sessions.activity_id, concept_results.activity_session_id, concept_results.extra_metadata, concept_results.question_number
      ) AS question_scores ON activity_sessions.id = question_scores.activity_session_id
      LEFT OUTER JOIN lms.questions ON question_scores.question_uid = questions.uid
      LEFT OUTER JOIN lms.diagnostic_question_skills ON questions.id = diagnostic_question_skills.question_id
      LEFT OUTER JOIN lms.skill_group_activities ON activity_sessions.activity_id = skill_group_activities.activity_id
      LEFT OUTER JOIN lms.skill_groups
        ON diagnostic_question_skills.skill_group_id = skill_groups.id
      WHERE classroom_units.created_at >= '2023-07-01 00:00:00'
        AND unit_activities.activity_id IN (NULL, 1663,1668,1678,1161,1568,1590,992,1229,1230,1432,2537,2539,2541,2550,2555,2563)
        AND classroom_units.visible = true
        AND (diagnostic_question_skills.skill_group_id = skill_group_activities.skill_group_id
          OR activity_sessions.id IS NULL)
      GROUP BY assigned_at,
        activity_session_id,
        activity_session_completed_at,
        activity_id,
        activity_name,
        post_activity_id,
        skill_group_id,
        skill_group_name,
        student_id,
        classroom_unit_id,
        classroom_id
  ) AS pre
  FULL OUTER JOIN (
    SELECT
        classroom_units.created_at AS assigned_at,
        activity_sessions.id AS activity_session_id,
        activity_sessions.completed_at AS activity_session_completed_at,
        unit_activities.activity_id AS activity_id,
        activities.id AS pre_activity_id,
        activities.name AS pre_activity_name,
        skill_groups.id AS skill_group_id,
        skill_groups.name AS skill_group_name,
        SUM(CAST(question_scores.correct AS int64)) questions_correct,
        COUNT(DISTINCT question_scores.question_number) AS questions_total,
        classroom_units.classroom_id AS classroom_id,
        CAST(assigned_student_id AS int64) AS student_id,
        classroom_units.id AS classroom_unit_id
      FROM lms.classroom_units
      JOIN lms.unit_activities ON classroom_units.unit_id = unit_activities.unit_id
      JOIN lms.activities ON unit_activities.activity_id = activities.follow_up_activity_id
      CROSS JOIN UNNEST(JSON_VALUE_ARRAY(classroom_units.assigned_student_ids)) AS assigned_student_id
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
      ) AS activity_sessions ON activity_sessions.classroom_unit_id = classroom_units.id AND activity_sessions.user_id = CAST(assigned_student_id AS int64) AND activity_sessions.activity_id = activities.follow_up_activity_id AND activity_sessions.visible = true
      LEFT OUTER JOIN (
        SELECT
            concept_results.activity_session_id,
            STRING(PARSE_JSON(concept_results.extra_metadata).question_uid) AS question_uid,
            concept_results.question_number,
            /*
              Old diagnostics use a more complicated way of scoring questions than new ones
              Some old style diagnostics have multiple concepts that they test for, and thus need to account for cases where there are multiple ConceptResults for a single answer, but only some of them count toward whether or not the question as a whole counts as "correct" or not
              New style diagnostics expect to always have only one ConceptResult for each student response, so we're effectively expecting to be doing LOGICAL_AND on a set of one item for each of them
            */
            CASE WHEN activity_sessions.activity_id IN (1664, 1680, 1669, 1774, 1814, 1818)
              THEN (
                COUNT(diagnostic_question_optimal_concepts.id) > 0 AND
                LOGICAL_AND(CASE WHEN diagnostic_question_optimal_concepts.id IS NOT NULL THEN concept_results.correct END)
              )
              ELSE LOGICAL_AND(concept_results.correct)
            END AS correct
          FROM lms.concept_results AS concept_results
          JOIN lms.activity_sessions ON concept_results.activity_session_id = activity_sessions.id
          LEFT OUTER JOIN lms.diagnostic_question_optimal_concepts ON STRING(PARSE_JSON(concept_results.extra_metadata).question_uid) = diagnostic_question_optimal_concepts.question_uid AND concept_results.concept_id = diagnostic_question_optimal_concepts.concept_id
          WHERE concept_results.attempt_number IS NULL
          GROUP BY activity_sessions.activity_id, concept_results.activity_session_id, concept_results.extra_metadata, concept_results.question_number
      ) AS question_scores ON activity_sessions.id = question_scores.activity_session_id
      LEFT OUTER JOIN lms.questions ON question_scores.question_uid = questions.uid
      LEFT OUTER JOIN lms.diagnostic_question_skills ON questions.id = diagnostic_question_skills.question_id
      LEFT OUTER JOIN lms.skill_group_activities ON activity_sessions.activity_id = skill_group_activities.activity_id
      LEFT OUTER JOIN lms.skill_groups
        ON diagnostic_question_skills.skill_group_id = skill_groups.id
          AND skill_group_activities.skill_group_id = skill_groups.id
      WHERE classroom_units.created_at >= '2023-07-01 00:00:00'
        AND unit_activities.activity_id IN (1664, 1680, 1669, 1774, 1814, 1818, 2538, 2540, 2542, 2551, 2557, 2564)
        AND classroom_units.visible = true
        AND (diagnostic_question_skills.skill_group_id = skill_group_activities.skill_group_id
          OR activity_sessions.id IS NULL)
      GROUP BY assigned_at,
        activity_session_id,
        activity_session_completed_at,
        activity_id,
        pre_activity_id,
        pre_activity_name,
        skill_group_id,
        skill_group_name,
        student_id,
        classroom_unit_id,
        classroom_id
  ) AS post
    ON pre.activity_id = post.pre_activity_id
      AND pre.student_id = post.student_id
      AND pre.skill_group_id = post.skill_group_id
      AND pre.classroom_id = post.classroom_id
  WHERE (pre.assigned_at >= '2023-07-01 00:00:00' OR post.assigned_at >= '2023-07-01 00:00:00')
