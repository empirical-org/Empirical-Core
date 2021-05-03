class RenameRuleDescriptionToRuleNote < ActiveRecord::Migration
  def change
    rename_column :comprehension_rules, :description, :note
  end
end
