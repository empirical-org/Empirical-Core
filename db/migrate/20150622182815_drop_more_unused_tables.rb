class DropMoreUnusedTables < ActiveRecord::Migration
  def change
    drop_table :activity_time_entries
    drop_table :assessments
  end
end
