# frozen_string_literal: true

namespace :feedback_histories do
  desc 'Change feedback_type to the ERROR type for any feedback history with the error feedback_text'
  task :set_error_type => :environment do
    error_feedback_text = 'Thank you for your response.'
    # We're doing this with raw SQL because the FeedbackHistory model is flagged as read-only
    # so ActiveRecord-based calls will refuse to update values
    sql = <<-SQL
      UPDATE feedback_histories
        SET feedback_type = '#{FeedbackHistory::ERROR}'
        WHERE feedback_text = '#{error_feedback_text}'
    SQL
    ActiveRecord::Base.connection.execute(sql)
  end
end
