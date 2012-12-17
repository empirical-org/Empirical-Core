class CMS::Course < ActiveRecord::Base
  self.table_name = 'courses'
  has_many :lectures, class_name: 'CMS::Lecture'
  attr_accessible :description, :professor_name, :title

  def self.name
    'Course'
  end
end
