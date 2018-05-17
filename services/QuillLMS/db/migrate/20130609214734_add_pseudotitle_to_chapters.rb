class AddPseudotitleToChapters < ActiveRecord::Migration
  def up
  	add_column :chapters, :description, :text
  end

  def down
  	remove_column :chapters, :description
  end
end
