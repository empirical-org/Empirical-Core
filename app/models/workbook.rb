class Workbook < ActiveRecord::Base
  attr_accessible :title
  has_many :chapters
  has_many :rules
end
