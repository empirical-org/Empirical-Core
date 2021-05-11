class UpdateComprehensionRuleSuborderTypeToInteger < ActiveRecord::Migration
  def change
    change_column :comprehension_rules, :suborder, 'integer USING CAST(suborder AS integer)', null: true
  end

  Comprehension::Rule.all.each do |rule|
    if rule.suborder != nil
      rule.suborder = rule.suborder.to_i
      rule.save!
    end
  end
end
