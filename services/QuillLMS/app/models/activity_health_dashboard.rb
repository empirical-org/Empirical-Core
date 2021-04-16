class ActivityHealthDashboard
  MAX_SESSIONS_VIEWED = 500

  def initialize(activity_id, question_number, question_uid)
    @activity_id = activity_id
    @question_number = question_number
    @question_uid = question_uid
  end

  # TODO a bunch of nil and error checkign here for different edge cases, cleaner injection methods
  def average_attempts_for_question
    correct_attempts_times_students = attempt_data.select { |a| a["correct"] == '1' }.map {|b| b["number_of_attempts"].to_i * b["number_of_students"].to_i}.inject(0){|sum,x| sum + x }
    fifth_attempts = attempt_data.select { |a| a["number_of_attempts"] == '5'}.sum{ |b| b["number_of_students"].to_i }&.to_f || 0
    total_attempts = attempt_data.select { |a| a["number_of_attempts"] == '1' }&.sum { |b| b["number_of_students"].to_i }&.to_f || 0
    total_attempts.zero? ? 0 : ((fifth_attempts * 5 + correct_attempts_times_students) / total_attempts).round(2)
  end

  def percent_reached_optimal_for_question
    optimal_obj = attempt_data.select { |a| a["correct"] == '1' }
    optimal_count = optimal_obj.any? ? optimal_obj.sum {|opt| opt["number_of_students"].to_i } : 0
    total_attempts = attempt_data.select { |a| a["number_of_attempts"] == '1' }&.sum { |b| b["number_of_students"].to_i }&.to_f || 0
    total_attempts.zero? ? 0 : ((optimal_count / total_attempts) * 100).round(2)
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
        cr.metadata::json->>'questionNumber' AS question,
        cr.metadata::json->>'attemptNumber' AS number_of_attempts,
        cr.metadata::json->>'correct' AS correct,
        COUNT(cr.metadata::json->>'attemptNumber') AS number_of_students
        FROM concept_results cr
        INNER JOIN (
          SELECT *
          FROM activity_sessions
          WHERE activity_id=#{@activity_id} LIMIT #{MAX_SESSIONS_VIEWED}
        ) act_s
        ON cr.activity_session_id = act_s.id
        WHERE cr.metadata::json->>'questionNumber' = '#{@question_number.to_s}'
        GROUP BY cr.metadata::json->>'questionNumber',
          cr.metadata::json->>'attemptNumber',
          cr.metadata::json->>'correct'
        ORDER BY number_of_attempts
      SQL
      ActiveRecord::Base.connection.execute(query).to_a
    end
  end

end
