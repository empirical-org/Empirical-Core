class AddScoreValuesToScores < ActiveRecord::Migration[4.2]
  def change
    add_column :scores, :score_values, :text
  end
end
