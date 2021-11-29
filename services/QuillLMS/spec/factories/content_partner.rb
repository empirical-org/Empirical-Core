# frozen_string_literal: true

FactoryBot.define do
  factory :content_partner do
    sequence(:name) { |i| "Content Partner #{i}" }
    description 'Some description'
  end
end
