class Rule < ActiveRecord::Base
  attr_accessible :title, :category_id, :workbook_id
  belongs_to :category
  belongs_to :workbook
  has_many :lessons
  validates :title, presence: true
end
