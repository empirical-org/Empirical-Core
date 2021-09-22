class ChangeCsvExportsTypeColumn < ActiveRecord::Migration[4.2]
  def change
    rename_column :csv_exports, :type, :export_type
  end
end
