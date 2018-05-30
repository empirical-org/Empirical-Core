class AddChapterLevelIdToChapters < ActiveRecord::Migration
  def change
    add_reference :chapters, :chapter_level, index: true
  end
end
