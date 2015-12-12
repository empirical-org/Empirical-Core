class FixRulesModel < ActiveRecord::Migration
  def change
    add_column :rules, :category_id, :integer
    add_column :rules, :workbook_id, :integer, default: 1
    remove_column :rules, :chapter_id
    remove_column :rules, :order
    rename_column :rules, :body, :title
  end
end
