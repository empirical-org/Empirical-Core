class Section < ActiveRecord::Base
  belongs_to :workbook
  has_many :topics
end
