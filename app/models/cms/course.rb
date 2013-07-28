class CMS::Course < ActiveRecord::Base
  self.table_name = 'courses'
  has_many :lectures, class_name: 'CMS::Lecture'

  def self.name
    'Course'
  end
end
