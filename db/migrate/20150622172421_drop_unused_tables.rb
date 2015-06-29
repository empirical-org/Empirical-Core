class DropUnusedTables < ActiveRecord::Migration
  def change
    drop_table :chapters
    drop_table :chapter_levels
    drop_table :classroom_chapters
    drop_table :grammar_rules
    drop_table :grammar_tests
    drop_table :rule_examples
    drop_table :rule_question_inputs
    drop_table :rule_questions
    drop_table :rules
    drop_table :scores
  end
end
