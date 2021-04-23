class ChangeAvgCompletionTimeColumn < ActiveRecord::Migration
  def change
    remove_column :activity_healths, :avg_completion_time
    add_column :activity_healths, :avg_mins_to_complete, :float
  end
end
