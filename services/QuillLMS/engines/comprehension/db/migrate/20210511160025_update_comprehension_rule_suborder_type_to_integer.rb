class UpdateComprehensionRuleSuborderTypeToInteger < ActiveRecord::Migration[4.2]
  def change
    change_column :comprehension_rules, :suborder, 'integer USING CAST(suborder AS integer)', null: true
  end
end
