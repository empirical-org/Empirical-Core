class CreateCsvExports < ActiveRecord::Migration[4.2]
  def change
    create_table :csv_exports do |t|
      t.string :type
      t.datetime :emailed_at
      t.json :filters
      t.integer :teacher_id
      t.timestamps
    end
  end
end
