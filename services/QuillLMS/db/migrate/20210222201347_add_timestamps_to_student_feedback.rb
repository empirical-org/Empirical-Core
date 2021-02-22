class AddTimestampsToStudentFeedback < ActiveRecord::Migration
  def change
    add_timestamps :student_feedback_responses
  end
end
