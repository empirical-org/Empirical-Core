# frozen_string_literal: true

class AddChapterLevelIdToChapters < ActiveRecord::Migration[4.2]
  def change
    add_reference :chapters, :chapter_level, index: true
  end
end
