class Standard < ActiveRecord::Base
  include Uid

  belongs_to :standard_grade
  belongs_to :standard_category

  has_many :activities, dependent: :destroy

  default_scope -> { order(:name) }

  validates :standard_grade, presence: true
  validates :name, presence: true, uniqueness: true

  def name_prefix
    name.split(' ').first
  end
end
