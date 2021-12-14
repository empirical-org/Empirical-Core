# frozen_string_literal: true

FactoryBot.define do
  factory :title_card do
    uid             SecureRandom.uuid
    content         'Some test content'
    title           'Card Title'
    title_card_type 'connect_title_card'
  end
end
