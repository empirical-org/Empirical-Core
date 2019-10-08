class ThirdPartyUserId < ActiveRecord::Base
  VALID_SOURCES = ["LEAP"].freeze

  belongs_to :user

  validates :user, presence: true
  validates :source, presence: true, inclusion: {in: VALID_SOURCES}
  validates :third_party_id, presence: true
end
