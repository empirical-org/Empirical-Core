namespace :update_feedback_history_type do
  desc 'update feedback histories with type "semantic" to "autoML" to match rule_type'
  task :run => :environment do
    FeedbackHistory.where(feedback_type: 'semantic').each do |feedback_history|
      feedback_history.update(feedback_type: 'autoML')
    end
  end
end
