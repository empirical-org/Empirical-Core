# frozen_string_literal: true

class RenameLessonsToRuleQuestions < ActiveRecord::Migration[4.2]
  def change
    rename_table 'lessons', 'rule_questions'
  end
end
