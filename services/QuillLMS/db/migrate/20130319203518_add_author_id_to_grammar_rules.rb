class AddAuthorIdToGrammarRules < ActiveRecord::Migration[4.2]
  def change
    add_column :grammar_rules, :author_id, :integer
  end
end
