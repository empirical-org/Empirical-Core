class Workbook < ActiveRecord::Base
  has_many :chapters
  has_many :rules
end
