class ChangeAvgCompletionTimeColumn < ActiveRecord::Migration
  def change
    remove_column :activity_healths, :avg_completion_time, :time
    add_column :activity_healths, :avg_mins_to_complete, :float
    add_column :activity_healths, :flag, :string
    rename_column :activity_healths, :recent_assignments, :recent_plays
  end
end
