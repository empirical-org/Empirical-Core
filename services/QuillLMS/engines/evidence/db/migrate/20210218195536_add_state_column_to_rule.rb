class AddStateColumnToRule < ActiveRecord::Migration[4.2]
  def change
    add_column :comprehension_rules, :state, :string
    Comprehension::Rule.update_all(state: Comprehension::Rule::STATE_ACTIVE)
    change_column :comprehension_rules, :state, :string, null: false
  end
end
