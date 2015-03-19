class AddIsFinalScoreToActivitySessions < ActiveRecord::Migration
  def change
  	add_column :activity_sessions, :is_final_score, :boolean, default: false
  end
end
