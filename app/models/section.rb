class Section < ActiveRecord::Base
  include CMS::Orderable

  orderable :position

  belongs_to :workbook
  has_many :topics, dependent: :destroy

  validates :workbook, presence: true
  validates :name, presence: true

end
