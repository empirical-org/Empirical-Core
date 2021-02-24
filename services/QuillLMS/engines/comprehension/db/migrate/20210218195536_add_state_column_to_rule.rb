class AddStateColumnToRule < ActiveRecord::Migration
  def change
    add_column :comprehension_rules, :state, :string, null: false
  end
end
