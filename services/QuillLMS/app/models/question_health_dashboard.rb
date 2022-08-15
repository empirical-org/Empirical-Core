# frozen_string_literal: true

class QuestionHealthDashboard
  MAX_SESSIONS_VIEWED = 500
  Y_INTERCEPT = 5
  SLOPE = 4

  def initialize(activity_id, question_number, question_uid)
    @activity_id = activity_id
    @question_number = question_number
    @question_uid = question_uid
  end

  def average_attempts_for_question
    all_attempts = attempt_data.count.to_f
    avg_score = attempt_data.sum { |h| h["score"].to_f } / all_attempts
    all_attempts.zero? ? 0 : score_to_attempts(avg_score).round(2)
  end

  def percent_reached_optimal_for_question
    failed_attempts = attempt_data.select { |a| a["score"] == 0 }.count.to_f
    all_attempts = attempt_data.count.to_f

    successful_attempts = all_attempts - failed_attempts

    all_attempts.zero? ? 0 : ((successful_attempts / all_attempts) * 100).round(2)
  end

  def cms_dashboard_stats
    JSON.parse(cms_data.body)
  rescue JSON::ParserError
    {}
  end

  private def score_to_attempts(score)
    Y_INTERCEPT - (SLOPE * score)
  end

  private def cms_data
    @cms_data ||= HTTParty.get("#{ENV['CMS_URL']}/questions/#{@question_uid}/question_dashboard_data")
  end

  private def attempt_data
    query = <<-SQL
      SELECT
      cr.question_score AS score,
      cr.activity_session_id
      FROM concept_results cr
      INNER JOIN (
        SELECT *
        FROM activity_sessions
        WHERE activity_id=#{@activity_id} LIMIT #{MAX_SESSIONS_VIEWED}
      ) act_s
      ON cr.activity_session_id = act_s.id
      WHERE cr.question_number = '#{@question_number}'
      GROUP BY
        cr.question_score,
        cr.activity_session_id
    SQL
    @attempt_data ||= RawSqlRunner.execute(query).to_a
  end
end
