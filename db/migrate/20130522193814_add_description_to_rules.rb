class AddDescriptionToRules < ActiveRecord::Migration
  def up
  	add_column :rules, :description, :text
  end

  def down
  	remove_column :rules, :description
  end
end
