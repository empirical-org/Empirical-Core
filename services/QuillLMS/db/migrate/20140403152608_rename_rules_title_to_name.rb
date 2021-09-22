class RenameRulesTitleToName < ActiveRecord::Migration[4.2]
  def change
    rename_column :rules, :title, :name
  end
end
