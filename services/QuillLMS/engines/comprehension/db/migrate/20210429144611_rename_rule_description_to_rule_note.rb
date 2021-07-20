class RenameRuleDescriptionToRuleNote < ActiveRecord::Migration[4.2]
  def change
    rename_column :comprehension_rules, :description, :note
  end
end
