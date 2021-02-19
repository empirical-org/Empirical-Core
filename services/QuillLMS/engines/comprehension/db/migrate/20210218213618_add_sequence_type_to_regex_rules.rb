class AddSequenceTypeToRegexRules < ActiveRecord::Migration
  def change
    add_column :comprehension_regex_rules, :sequence_type, :text, null: false, default: "incorrect"
    change_column :comprehension_rules, :suborder, :text, null: true
  end

  Comprehension::Rule.all.each { |r| r.update!(suborder:nil) if r.rule_type == Comprehension::Rule::TYPE_PLAGIARISM }
end
