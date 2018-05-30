class RemoveTimeSpentFromActivitySessions < ActiveRecord::Migration
  def change
    remove_column :activity_sessions, :time_spent
  end
end
