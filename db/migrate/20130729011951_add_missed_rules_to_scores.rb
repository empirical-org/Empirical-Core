class AddMissedRulesToScores < ActiveRecord::Migration
  def change
    add_column :scores, :missed_rules, :text
  end
end
