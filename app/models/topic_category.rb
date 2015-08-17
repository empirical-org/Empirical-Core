class TopicCategory < ActiveRecord::Base
  extend ApiData
  include Uid
	has_many :topics

	validates :name, presence: true, uniqueness: true

end