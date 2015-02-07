class AddIsRetryToActivitySessions < ActiveRecord::Migration
  def change
  	add_column :activity_sessions, :is_retry, :boolean, default: false
  end
end
