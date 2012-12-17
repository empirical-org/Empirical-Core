class CMS::Lecture < ActiveRecord::Base
  self.table_name = 'lectures'
  belongs_to :course, class_name: 'CMS::Course'
  has_many :lecture_chapters, class_name: 'CMS::LectureChapter'
  attr_accessible :course_id, :description, :lecturer_name, :title

  def self.name
    'Lecture'
  end
end
