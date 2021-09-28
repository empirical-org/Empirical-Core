class CreateStudentProblemReport < ActiveRecord::Migration[5.1]
  def change
    create_table :student_problem_reports do |t|
      t.references :feedback_history, index: true, foreign_key: true, null: false
      t.string :report, null: false

      t.timestamps
    end
  end
end
