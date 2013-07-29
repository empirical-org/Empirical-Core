class AddScoreValuesToScores < ActiveRecord::Migration
  def change
    add_column :scores, :score_values, :text
  end
end
