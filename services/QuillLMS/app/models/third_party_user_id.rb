# frozen_string_literal: true

# == Schema Information
#
# Table name: third_party_user_ids
#
#  id             :integer          not null, primary key
#  source         :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  third_party_id :string
#  user_id        :integer
#
# Indexes
#
#  index_third_party_user_ids_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class ThirdPartyUserId < ApplicationRecord

  module SOURCES
    LEAP = "LEAP"
  end

  VALID_SOURCES = [SOURCES::LEAP].freeze

  belongs_to :user

  validates :user, presence: true
  validates :source, presence: true, inclusion: {in: VALID_SOURCES}
  validates :third_party_id, presence: true
end
