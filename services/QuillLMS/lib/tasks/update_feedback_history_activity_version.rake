# frozen_string_literal: true

namespace :update_feedback_history_activity_version do
  desc 'update feedback histories with type "semantic" to "autoML" to match rule_type'
  task :run => :environment do
    FeedbackHistory.where(activity_version: 0).each do |feedback_history|
      feedback_history.update_column(:activity_version, 1)
    end
  end
end
