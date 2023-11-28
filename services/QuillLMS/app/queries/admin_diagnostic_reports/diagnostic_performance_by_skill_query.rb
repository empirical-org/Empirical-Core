# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticPerformanceBySkillQuery < DiagnosticAggregateQuery
    class InvalidDiagnosticIdError < StandardError; end

    attr_reader :diagnostic_id

    AGGREGATE_COLUMN = :skill_name

    def initialize(diagnostic_id:, **options)
      raise InvalidDiagnosticIdError, "#{diagnostic_id} is not a valid diagnostic_id value." unless DIAGNOSTIC_ORDER_BY_ID.include?(diagnostic_id)

      @diagnostic_id = diagnostic_id

      super(**options)
    end

    def specific_select_clause
      <<-SQL
        students.id AS student_id,
        MAX(pre_activity_sessions.id) AS pre_activity_session_id,
        MAX(post_activity_sessions.id) AS post_activity_session_id
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
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
      SQL
    end

    def rollup_select_columns
      "skill_name"
    end

    def select_clause
      <<-SQL
        SELECT
          #{aggregate_by_clause} AS aggregate_id,
          #{aggregate_sort_clause} AS name,
          '#{additional_aggregation}' AS group_by,
          #{specific_select_clause}
      SQL
    end

    def with_queries
      {
        most_recent_activity_sessions: query,
        pre_questions_correct:,
        pre_skill_scores:,
        post_questions_correct:,
        post_skill_scores:,
        with_improvement:,
        aggregate_rows: aggregate_query
      }
    end

    def pre_questions_correct
      <<-SQL
        SELECT
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
      SQL
    end

    def pre_skill_scores
      <<-SQL
        SELECT
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
      SQL
    end

    def post_questions_correct
      <<-SQL
        SELECT
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
      SQL
    end

    def post_skill_scores
      <<-SQL
        SELECT
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
      SQL
    end

    def with_improvement
      <<-SQL
        SELECT
          most_recent_activity_sessions.student_id,
          most_recent_activity_sessions.pre_activity_session_id,
          most_recent_activity_sessions.post_activity_session_id,
          most_recent_activity_sessions.aggregate_id,
          most_recent_activity_sessions.name,
          most_recent_activity_sessions.group_by,
          COUNT(DISTINCT post_skill_scores.student_id) AS total_students,
          COUNT(DISTINCT CASE WHEN
            (pre_correct_total = pre_total_questions
              AND post_correct_total = post_total_questions
            ) THEN post_skill_scores.student_id ELSE NULL END) AS maintained_proficiency,
          COUNT(DISTINCT CASE WHEN
            (pre_correct_total < pre_total_questions
              AND post_correct_total > pre_correct_total
            ) THEN post_skill_scores.student_id ELSE NULL END) AS improved_proficiency,
          COUNT(DISTINCT CASE WHEN
            (pre_correct_total < pre_total_questions
              AND post_correct_total <= pre_correct_total
            ) THEN post_skill_scores.student_id ELSE NULL END) AS recommended_practice
        FROM most_recent_activity_sessions
        JOIN pre_skill_scores
          ON most_recent_activity_sessions.pre_activity_session_id = pre_skill_scores.pre_activity_session_id
        LEFT OUTER JOIN post_skill_scores
          ON most_recent_activity_sessions.post_activity_session_id = post_skill_scores.post_activity_session_id
            AND pre_skill_scores.skill_name = post_skill_scores.skill_name
        GROUP BY most_recent_activity_sessions.student_id, most_recent_activity_sessions.pre_activity_session_id, most_recent_activity_sessions.post_activity_session_id, aggregate_id, name, group_by
      SQL
    end

    def aggregate_query
      <<-SQL
        SELECT
          pre_skill_scores.skill_name,
          with_improvement.aggregate_id,
          with_improvement.name,
          with_improvement.group_by,
          #{rollup_aggregation_select}
        FROM most_recent_activity_sessions
        JOIN pre_skill_scores
          ON most_recent_activity_sessions.pre_activity_session_id = pre_skill_scores.pre_activity_session_id
        LEFT OUTER JOIN post_skill_scores
          ON most_recent_activity_sessions.post_activity_session_id = post_skill_scores.post_activity_session_id
            AND pre_skill_scores.skill_name = post_skill_scores.skill_name
        LEFT OUTER JOIN with_improvement
          ON most_recent_activity_sessions.student_id = with_improvement.student_id
        GROUP BY aggregate_id, name, skill_name, group_by
      SQL
    end

    def relevant_diagnostic_where_clause
        "AND activities.id = #{diagnostic_id}"
    end

    def group_by_clause
      "GROUP BY aggregate_id, #{aggregate_sort_clause}, student_id"
    end

    def relevant_date_column
      "pre_activity_sessions.completed_at"
    end

    private def rollup_aggregation_hash
      {
        pre_score: percentage_aggregate(:pre_correct_total, :pre_total_questions),
        post_score: percentage_aggregate(:post_correct_total, :post_total_questions),
        pre_correct_total: sum_aggregate,
        pre_total_questions: sum_aggregate,
        post_correct_total: sum_aggregate,
        post_total_questions: sum_aggregate,
        total_students: sum_aggregate,
        maintained_proficiency: sum_aggregate,
        improved_proficiency: sum_aggregate,
        recommended_practice: sum_aggregate
      }
    end
  end
end
