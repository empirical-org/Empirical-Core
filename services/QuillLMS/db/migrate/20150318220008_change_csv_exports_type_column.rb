class ChangeCsvExportsTypeColumn < ActiveRecord::Migration
  def change
    rename_column :csv_exports, :type, :export_type
  end
end
