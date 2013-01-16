class CMS::ChapterGroup < ActiveRecord::Base
  self.table_name = 'chapter_groups'
  belongs_to :lecture, class_name: 'CMS::Lecture'
  has_many :lecture_chapters, class_name: 'CMS::LectureChapter'
  attr_accessible :lecture_id, :title

  def self.name
    'ChapterGroup'
  end
end
