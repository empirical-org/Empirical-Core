# frozen_string_literal: true

FactoryBot.define do
  factory :author do
    sequence(:name) { |n| "Author Name #{n}"}
    avatar { "https://placehold.it/300x300.png" }
  end
end
