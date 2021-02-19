class CreateStudentFeedbackResponses < ActiveRecord::Migration
  def change
    create_table :student_feedback_responses do |t|
      t.text :question, default: ''
      t.text :response, default: ''
      t.string :grade_levels, array: true, default: []
    end
  end
end
