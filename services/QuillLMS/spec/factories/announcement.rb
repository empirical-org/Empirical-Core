# frozen_string_literal: true

FactoryBot.define do
  factory :announcement do
    announcement_type   Announcement::TYPES[:webinar]
    add_attribute(:start)            { Date.today - 1.days }
    add_attribute(:end)              { Date.today + 1.days }
    link                { "https://www.not-a-url.com/" }
    text                { "Test text with no meaning." }

    trait :expired do
      add_attribute(:start) { Date.today - 2.days }
      add_attribute(:end)   { Date.today - 1.days }
    end

    trait :not_yet_started do
      add_attribute(:start) { Date.today + 1.days }
      add_attribute(:end)   { Date.today + 2.days }
    end
  end
end
