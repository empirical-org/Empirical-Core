class AddAuthorIdToGrammarRules < ActiveRecord::Migration
  def change
    add_column :grammar_rules, :author_id, :integer
  end
end
