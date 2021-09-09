class AddSequenceTypeToRegexRules < ActiveRecord::Migration[4.2]
  def change
    add_column :comprehension_regex_rules, :sequence_type, :text, null: false, default: "incorrect"
    change_column :comprehension_rules, :suborder, :text, null: true
  end

  Evidence::Rule.all.each { |r| r.update!(suborder: nil) if r.rule_type == Evidence::Rule::TYPE_PLAGIARISM }
end
