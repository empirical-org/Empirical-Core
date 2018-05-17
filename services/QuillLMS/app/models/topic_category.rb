class TopicCategory < ActiveRecord::Base
  include Uid
	has_many :topics

	validates :name, presence: true, uniqueness: true

end