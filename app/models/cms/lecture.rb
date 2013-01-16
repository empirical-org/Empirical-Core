class CMS::Lecture < ActiveRecord::Base
  self.table_name = 'lectures'
  belongs_to :course, class_name: 'CMS::Course'
  has_many :chapter_groups, class_name: 'CMS::ChapterGroup'
  attr_accessible :course_id, :description, :lecturer_name, :title

  def self.name
    'Lecture'
  end
end
