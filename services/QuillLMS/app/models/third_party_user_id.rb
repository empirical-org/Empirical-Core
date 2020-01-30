class ThirdPartyUserId < ActiveRecord::Base

  module SOURCES
    LEAP ||= "LEAP"
  end

  VALID_SOURCES = [SOURCES::LEAP].freeze

  belongs_to :user

  validates :user, presence: true
  validates :source, presence: true, inclusion: {in: VALID_SOURCES}
  validates :third_party_id, presence: true
end
