class Workbook < ActiveRecord::Base
  attr_accessible :title
  has_many :chapters
end
