class CMS::LectureChapter < ActiveRecord::Base
  self.table_name = 'lecture_chapters'
  belongs_to :chapter_group, class_name: 'CMS::ChapterGroup'
  has_many :lecture_chapter_images, class_name: 'CMS::LectureChapterImage'
  has_many :questions
  include CMS::Orderable
  orderable(:position, order_scope: "chapter_group")

  has_many :comments

  def self.name
    'LectureChapter'
  end
end
