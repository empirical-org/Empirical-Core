# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_instances
#
#  id         :bigint           not null, primary key
#  url        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_canvas_instances_on_url  (url) UNIQUE
#
FactoryBot.define do
  factory :canvas_instance do
    url { "https://#{Faker::Internet.domain_word}.instructure.com" }

    trait :with_canvas_config do
      after(:create) { |canvas_instance| create(:canvas_config, canvas_instance: canvas_instance) }
    end
  end
end
