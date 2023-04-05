# frozen_string_literal: true

FactoryBot.define do
  factory :learn_worlds_account do
    user
    external_id { SecureRandom.hex(12) }
  end
end
