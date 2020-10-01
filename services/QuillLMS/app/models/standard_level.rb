class StandardLevel < ActiveRecord::Base
  include Uid
  include RankedModel

  ranks :position

  has_many :standards, dependent: :destroy

  validates :name, presence: true
end
