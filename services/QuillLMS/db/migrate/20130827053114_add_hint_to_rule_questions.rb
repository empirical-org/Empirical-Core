class AddHintToRuleQuestions < ActiveRecord::Migration[4.2]
  def change
    add_column :rule_questions, :instructions, :text
    add_column :rule_questions, :hint, :text
  end
end
