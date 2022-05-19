# frozen_string_literal: true

# == Schema Information
#
# Table name: announcements
#
#  id                :integer          not null, primary key
#  announcement_type :string
#  end               :datetime
#  link              :text
#  start             :datetime
#  text              :text
#
# Indexes
#
#  index_announcements_on_start_and_end  (start,end)
#
FactoryBot.define do
  factory :announcement do
    announcement_type   Announcement::TYPES[:webinar]
    add_attribute(:start) { 1.day.ago }
    add_attribute(:end) { 1.day.from_now }
    link { "https://www.not-a-url.com/" }
    text { "Test text with no meaning." }

    trait :expired do
      add_attribute(:start) { 2.days.ago }
      add_attribute(:end)   { 1.day.ago }
    end

    trait :not_yet_started do
      add_attribute(:start) { 1.day.from_now }
      add_attribute(:end)   { 2.days.from_now }
    end
  end
end
