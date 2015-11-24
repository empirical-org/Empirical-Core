class AddVisibleColumnToActivitySessions < ActiveRecord::Migration
  def change
    add_column :activity_sessions, :visible, :boolean, null: false, default: true
  end
end
