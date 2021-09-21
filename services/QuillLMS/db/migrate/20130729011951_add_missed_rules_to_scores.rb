class AddMissedRulesToScores < ActiveRecord::Migration[4.2]
  def change
    add_column :scores, :missed_rules, :text
  end
end
