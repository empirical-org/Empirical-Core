class Standard < ActiveRecord::Base
  include Uid

  belongs_to :standard_level
  belongs_to :standard_category

  default_scope -> { order(:name) }

  validates :standard_level, presence: true
  validates :name, presence: true, uniqueness: true

  def name_prefix
    name.split(' ').first
  end
end
