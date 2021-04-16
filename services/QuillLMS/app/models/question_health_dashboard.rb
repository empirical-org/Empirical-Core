class QuestionHealthDashboard
  MAX_SESSIONS_VIEWED = 500

  def initialize(activity_id, question_number, question_uid)
    @activity_id = activity_id
    @question_number = question_number
    @question_uid = question_uid
  end

  def average_attempts_for_question
    failed_attempts = attempt_data.select { |a| a["number_of_attempts"] == '5' && a["correct"] == '0'}
    correct_attempts = attempt_data.select { |a| a["correct"] == '1' }

    all_first_attempts = attempt_data.select { |a| a["number_of_attempts"] == '1' }
    total_count = total_students(all_first_attempts)

    correct_attempts_times_students = attempts_times_students(correct_attempts).sum
    failed_attempts_times_students = attempts_times_students(failed_attempts).sum

    total_count.zero? ? 0 : ((failed_attempts_times_students + correct_attempts_times_students) / total_count).round(2)
  end

  def percent_reached_optimal_for_question
    optimal_attempts = attempt_data.select { |a| a["correct"] == '1' }
    all_first_attempts = attempt_data.select { |a| a["number_of_attempts"] == '1' }

    optimal_count = total_students(optimal_attempts)
    total_count = total_students(all_first_attempts)

    total_count.zero? ? 0 : ((optimal_count / total_count) * 100).round(2)
  end

  def cms_dashboard_stats
    JSON.parse(cms_data.body)
  end

  private def total_students(hash)
    hash&.sum { |h| h["number_of_students"].to_i }&.to_f || 0
  end

  private def attempts_times_students(hash)
    hash&.map { |h| h["number_of_attempts"].to_i * h["number_of_students"].to_i} || 0
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
        WHERE cr.metadata::json->>'questionNumber' = '#{@question_number}'
        GROUP BY cr.metadata::json->>'questionNumber',
          cr.metadata::json->>'attemptNumber',
          cr.metadata::json->>'correct'
        ORDER BY number_of_attempts
      SQL
      ActiveRecord::Base.connection.execute(query).to_a
    end
  end

end
