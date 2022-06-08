# frozen_string_literal: true

# == Schema Information
#
# Table name: response_instructions
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_instructions_on_text  (text) UNIQUE
#
FactoryBot.define do
  factory :response_instructions, class: 'ResponseInstructions' do
    sequence(:text) { |n| "This a student response directions #{n}." }
  end
end
