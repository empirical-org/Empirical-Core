class AddStateColumnToRule < ActiveRecord::Migration
  def change
    add_column :comprehension_rules, :state, :string
    Comprehension::Rule.update_all(state: Comprehension::Rule::STATE_ACTIVE)
    change_column :comprehension_rules, :state, :string, null: false
  end
end
