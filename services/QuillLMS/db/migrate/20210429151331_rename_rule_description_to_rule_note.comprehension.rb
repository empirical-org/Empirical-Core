# This migration comes from comprehension (originally 20210429144611)
class RenameRuleDescriptionToRuleNote < ActiveRecord::Migration
  def change
    rename_column :comprehension_rules, :description, :note
  end
end
