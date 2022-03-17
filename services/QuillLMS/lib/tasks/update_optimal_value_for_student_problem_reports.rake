# frozen_string_literal: true

namespace :update_optimal_value_for_student_problem_reports do
  desc 'update optimal value for student problem reports based off of feedback history'
  task :run => :environment do
    StudentProblemReport.all.each do |report|
      is_optimal = FeedbackHistory.find(report.feedback_history_id)&.optimal
      report.optimal = is_optimal if !is_optimal.nil?
      report.save!
    end
  end
end
