class AddPracticeDescriptionToChapters < ActiveRecord::Migration
  def change
    add_column :chapters, :practice_description, :text
  end
end
