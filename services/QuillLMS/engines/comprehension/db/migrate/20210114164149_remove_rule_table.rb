class RemoveRuleTable < ActiveRecord::Migration
  def change
    drop_table :comprehension_rules
  end
end
