class Rule < ActiveRecord::Base
  attr_accessible :title, :category_id, :workbook_id
  belongs_to :category
  has_many :lessons
end
