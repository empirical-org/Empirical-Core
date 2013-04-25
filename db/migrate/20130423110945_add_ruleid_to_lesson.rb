class AddRuleidToLesson < ActiveRecord::Migration
  def change
    add_column :lessons, :rule_id, :integer
    remove_column :lessons, :rule
  end
end
