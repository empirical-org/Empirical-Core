# This migration comes from comprehension (originally 20210114164149)
class RemoveRuleTable < ActiveRecord::Migration[4.2]
  def change
    drop_table :comprehension_rules
  end
end
