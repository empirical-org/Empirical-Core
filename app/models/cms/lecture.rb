class CMS::Lecture < ActiveRecord::Base
  self.table_name = 'lectures'
  belongs_to :course, class_name: 'CMS::Course'
  has_many :chapter_groups, class_name: 'CMS::ChapterGroup'

  def self.name
    'Lecture'
  end
end
