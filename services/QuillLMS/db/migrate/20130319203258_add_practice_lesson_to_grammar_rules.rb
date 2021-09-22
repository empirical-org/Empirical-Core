class AddPracticeLessonToGrammarRules < ActiveRecord::Migration[4.2]
  def change
    add_column :grammar_rules, :practice_lesson, :text
  end
end
