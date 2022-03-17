# frozen_string_literal: true

class AddOptimalFieldToStudentProblemReport < ActiveRecord::Migration[5.1]
  def change
    add_column :student_problem_reports, :optimal, :boolean, null: false, default: false
  end
end
