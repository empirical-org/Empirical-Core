class RenameRulesTitleToName < ActiveRecord::Migration
  def change
    rename_column :rules, :title, :name
  end
end
