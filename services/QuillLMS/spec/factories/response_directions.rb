# frozen_string_literal: true

# == Schema Information
#
# Table name: response_directions
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_directions_on_text  (text) UNIQUE
#
FactoryBot.define do
  factory :response_directions, class: 'ResponseDirections' do
    sequence(:text) { |n| "This a student response directions #{n}." }
  end
end
