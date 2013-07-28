class CMS::LectureChapterImage < ActiveRecord::Base
  self.table_name = 'lecture_chapter_images'
  belongs_to :lecture_chapter, class_name: 'CMS::LectureChapter'
  mount_uploader :image_file, CMS::Uploader

  def self.name
    'LectureChapterImage'
  end
end
