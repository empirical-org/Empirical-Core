class AddRuleidToLesson < ActiveRecord::Migration[4.2]
  def change
    add_column :lessons, :rule_id, :integer
    remove_column :lessons, :rule
  end
end
