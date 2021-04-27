class QuestionHealthDashboard
  MAX_SESSIONS_VIEWED = 500

  def initialize(activity_id, question_number, question_uid)
    @activity_id = activity_id
    @question_number = question_number
    @question_uid = question_uid
  end

  def average_attempts_for_question
    all_attempts = attempt_data.count.to_f
    all_attempts.zero? ? 0 : (5 - ((attempt_data&.sum { |h| h["correct"].to_f }&.to_f / all_attempts) * 4)).round(2)
  end

  def percent_reached_optimal_for_question
    failed_attempts = attempt_data.select { |a| a["correct"] == '0' }.count.to_f
    all_attempts = attempt_data.count.to_f

    successful_attempts = all_attempts - failed_attempts

    all_attempts.zero? ? 0 : ((successful_attempts / all_attempts) * 100).round(2)
  end

  def cms_dashboard_stats
    JSON.parse(cms_data.body)
  end

  private def cms_data
    @cms_data ||= HTTParty.get("#{ENV['CMS_URL']}/questions/#{@question_uid}/question_dashboard_data")
  end

  private def attempt_data
    @attempt_data ||= begin
      query = <<-SQL
        SELECT
        cr.metadata::json->>'questionScore' AS correct,
        cr.activity_session_id
        FROM concept_results cr
        INNER JOIN (
          SELECT *
          FROM activity_sessions
          WHERE activity_id=#{@activity_id} LIMIT #{MAX_SESSIONS_VIEWED}
        ) act_s
        ON cr.activity_session_id = act_s.id
        WHERE cr.metadata::json->>'questionNumber' = '#{@question_number}'
        GROUP BY
          cr.metadata::json->>'questionScore',
          cr.activity_session_id
      SQL
      ActiveRecord::Base.connection.execute(query).to_a
    end
  end

end
