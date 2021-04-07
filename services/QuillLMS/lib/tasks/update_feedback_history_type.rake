namespace :update_feedback_history_type do
  desc 'update feedback histories with type "semantic" to "autoML" to match rule_type'
  task :run => :environment do
    FeedbackHistory.all.each do |feedback_history|
      if feedback_history.feedback_type == 'semantic'
        feedback_history.feedback_type = 'autoML'
        feedback_history.save!
      end
    end
  end
end
