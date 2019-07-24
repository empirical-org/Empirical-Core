class MoreIndexImprovements < ActiveRecord::Migration
  def change
    add_index :rule_question_inputs, :rule_question_id
    add_index :rule_question_inputs, :activity_session_id
    add_index :rule_question_inputs, :step

  end
end
