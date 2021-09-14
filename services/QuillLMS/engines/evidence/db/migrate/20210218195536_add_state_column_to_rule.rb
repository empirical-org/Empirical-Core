class AddStateColumnToRule < ActiveRecord::Migration[4.2]
  def change
    add_column :comprehension_rules, :state, :string
    Evidence::Rule.update_all(state: Evidence::Rule::STATE_ACTIVE)
    change_column :comprehension_rules, :state, :string, null: false
  end
end
