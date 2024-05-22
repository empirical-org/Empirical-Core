# frozen_string_literal: true

class CreateDiagnosticQuestionSkills < ActiveRecord::Migration[6.1]
  def change
    create_table :diagnostic_question_skills do |t|
      t.string :name, null: false
      t.references :question, index: true, foreign_key: true, null: false
      t.references :skill_group, index: true, foreign_key: true, null: false

      t.timestamps
    end
  end
end
