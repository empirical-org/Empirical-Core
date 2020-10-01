class StandardCategory < ActiveRecord::Base
  include Uid
	has_many :standards

	validates :name, presence: true, uniqueness: true
end
