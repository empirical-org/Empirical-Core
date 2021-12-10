# frozen_string_literal: true

class AddTimestampsToStudentFeedback < ActiveRecord::Migration[4.2]
  def change
    add_timestamps :student_feedback_responses
  end
end
