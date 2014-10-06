class Section < ActiveRecord::Base
  include CMS::Orderable

  orderable :position

  belongs_to :workbook
  has_many :topics, dependent: :destroy

  validates :workbook, presence: true
  validates :name, presence: true

  before_validation :assign_workbook

  private

  def assign_workbook
    self.workbook = Workbook.first if workbook.nil?
  end

end
