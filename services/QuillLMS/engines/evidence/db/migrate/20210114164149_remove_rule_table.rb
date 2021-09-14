class RemoveRuleTable < ActiveRecord::Migration[4.2]
  def change
    drop_table :comprehension_rules
  end
end
