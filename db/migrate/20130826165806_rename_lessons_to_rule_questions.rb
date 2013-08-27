class RenameLessonsToRuleQuestions < ActiveRecord::Migration
  def change
    rename_table 'lessons', 'rule_questions'
  end
end
