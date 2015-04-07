class Section < ActiveRecord::Base
  include RankedModel

  ranks :position

  belongs_to :workbook
  has_many :topics, dependent: :destroy

  validates :name, presence: true
end
