class AddCsvFileToCsvExports < ActiveRecord::Migration
  def change
    add_column :csv_exports, :csv_file, :string
  end
end
