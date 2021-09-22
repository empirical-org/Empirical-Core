class RemoveTimeSpentFromActivitySessions < ActiveRecord::Migration[4.2]
  def change
    remove_column :activity_sessions, :time_spent
  end
end
