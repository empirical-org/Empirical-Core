class AddCsvFileToCsvExports < ActiveRecord::Migration[4.2]
  def change
    add_column :csv_exports, :csv_file, :string
  end
end
