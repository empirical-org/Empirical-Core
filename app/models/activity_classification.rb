class ActivityClassification < ActiveRecord::Base

  include Uid

  has_many :activities, dependent: :destroy

  validates :key, uniqueness: true, presence: true

end
