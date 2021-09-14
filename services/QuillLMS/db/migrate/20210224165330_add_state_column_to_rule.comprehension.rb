# This migration comes from comprehension (originally 20210218195536)
class AddStateColumnToRule < ActiveRecord::Migration[4.2]
  def change
    add_column :comprehension_rules, :state, :string
    Evidence::Rule.update_all(state: 'active')
    change_column :comprehension_rules, :state, :string, null: false
  end
end
