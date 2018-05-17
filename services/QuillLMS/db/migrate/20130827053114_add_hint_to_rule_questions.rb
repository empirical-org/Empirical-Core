class AddHintToRuleQuestions < ActiveRecord::Migration
  def change
    add_column :rule_questions, :instructions, :text
    add_column :rule_questions, :hint, :text
  end
end
