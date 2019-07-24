class AddPracticeLessonToGrammarRules < ActiveRecord::Migration
  def change
    add_column :grammar_rules, :practice_lesson, :text
  end
end
