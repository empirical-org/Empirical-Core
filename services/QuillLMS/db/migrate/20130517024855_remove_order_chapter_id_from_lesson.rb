# frozen_string_literal: true

class RemoveOrderChapterIdFromLesson < ActiveRecord::Migration[4.2]
  def up
    remove_column :lessons, :order
    remove_column :lessons, :chapter_id
  end

  def down
    add_column :lessons, :order, :integer
    add_column :lessons, :chapter_id, :integer
  end
end
