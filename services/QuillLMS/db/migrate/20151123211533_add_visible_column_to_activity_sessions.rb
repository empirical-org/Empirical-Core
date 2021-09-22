class AddVisibleColumnToActivitySessions < ActiveRecord::Migration[4.2]
  def change
    add_column :activity_sessions, :visible, :boolean, null: false, default: true
  end
end
