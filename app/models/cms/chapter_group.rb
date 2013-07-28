class CMS::ChapterGroup < ActiveRecord::Base
  self.table_name = 'chapter_groups'
  belongs_to :lecture, class_name: 'CMS::Lecture'
  has_many :lecture_chapters, class_name: 'CMS::LectureChapter'
  include CMS::Orderable
  orderable(:position, order_scope: "lecture")

  def self.name
    'ChapterGroup'
  end
end
