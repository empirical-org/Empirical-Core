class CreateChapterGroups < ActiveRecord::Migration
  def change
    create_table :chapter_groups do |t|
      t.string :title
      t.belongs_to :lecture
      t.timestamps
    end

    add_index :chapter_groups, :lecture_id

    add_column :lecture_chapters, :chapter_group_id, :integer
    add_index  :lecture_chapters, :chapter_group_id

    CMS::LectureChapter.all.each do |chapter|
      next if chapter.chapter_group.present?
      group = CMS::ChapterGroup.create(title: "Chapter group for: #{chapter.title}", lecture_id: chapter.lecture_id, position: chapter.position)
      chapter.chapter_group = group
      chapter.save!
    end
  end
end
