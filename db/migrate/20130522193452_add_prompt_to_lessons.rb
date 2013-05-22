class AddPromptToLessons < ActiveRecord::Migration
  def up
  	add_column :lessons, :prompt, :text
  end

  def down
  	remove_column :lessons, :prompt
  end
end
