class Rule < ActiveRecord::Base
  belongs_to :category
  belongs_to :workbook
  has_many :lessons
  validates :title, presence: true
end
