# frozen_string_literal: true

class CreateRuleQuestionInputs < ActiveRecord::Migration[4.2]
  def change
    create_table :rule_question_inputs do |t|
      t.string :step
      t.belongs_to :rule_question
      t.belongs_to :score
      t.text :first_input
      t.text :second_input

      t.timestamps
    end
  end
end
