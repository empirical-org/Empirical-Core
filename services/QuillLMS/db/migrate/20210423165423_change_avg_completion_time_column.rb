class ChangeAvgCompletionTimeColumn < ActiveRecord::Migration
  def change
    remove_column :activity_healths, :avg_completion_time, :time
    remove_column :activity_healths, :recent_assignments, :integer
    add_column :activity_healths, :avg_mins_to_complete, :float
    add_column :activity_healths, :flag, :string
    add_column :activity_healths, :recent_plays, :integer
  end
end
