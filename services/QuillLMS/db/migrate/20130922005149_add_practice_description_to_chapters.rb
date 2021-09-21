class AddPracticeDescriptionToChapters < ActiveRecord::Migration[4.2]
  def change
    add_column :chapters, :practice_description, :text
  end
end
