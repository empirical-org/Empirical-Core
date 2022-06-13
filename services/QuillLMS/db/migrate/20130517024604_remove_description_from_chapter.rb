# frozen_string_literal: true

class RemoveDescriptionFromChapter < ActiveRecord::Migration[4.2]
  def up
    remove_column :chapters, :description
  end

  def down
    add_column :chapters, :description, :text
  end
end
