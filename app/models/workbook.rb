class Workbook < ActiveRecord::Base

  has_many :sections, dependent: :destroy

  validates :title, presence: true
end
