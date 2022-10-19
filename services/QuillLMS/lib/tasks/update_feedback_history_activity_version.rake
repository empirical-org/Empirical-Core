# frozen_string_literal: true

namespace :update_feedback_history_activity_version do
  desc 'update feedback histories with activity_version 0 to 1'
  task :run => :environment do
    FeedbackHistory.where(activity_version: 0).update_all(activity_version: 1)
  end
end
