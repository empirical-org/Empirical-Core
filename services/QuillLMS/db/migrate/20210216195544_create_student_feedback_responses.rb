class CreateStudentFeedbackResponses < ActiveRecord::Migration
  def change
    create_table :student_feedback_responses do |t|
      t.text :question
      t.text :response
      t.string :grade_levels, array: true
    end
  end
end
