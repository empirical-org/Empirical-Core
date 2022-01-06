# frozen_string_literal: true

# This migration comes from evidence (originally 20220105145314)
class RemoveUniquenessConstraintFromPlagiarismTextsOnRuleId < ActiveRecord::Migration[5.1]
  def change
    remove_index :comprehension_plagiarism_texts, :rule_id
    add_index :comprehension_plagiarism_texts, :rule_id
  end
end
