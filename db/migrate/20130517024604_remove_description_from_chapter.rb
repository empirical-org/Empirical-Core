class RemoveDescriptionFromChapter < ActiveRecord::Migration
  def up
  	remove_column :chapters, :description
  end

  def down
  	add_column :chapters, :description, :text
  end
end
