class Section < ActiveRecord::Base
  include Uid
  include RankedModel

  ranks :position

  has_many :topics, dependent: :destroy

  validates :name, presence: true
end
