class DropMoreUnusedTables < ActiveRecord::Migration[4.2]
  def change
    drop_table :activity_time_entries
    drop_table :assessments
  end
end
