class AddRulePositionToChapters < ActiveRecord::Migration
  def change
    add_column :chapters, :rule_position, :text
  end
end
