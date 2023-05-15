# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_highlights
#
#  id             :integer          not null, primary key
#  feedback_id    :integer          not null
#  text           :string           not null
#  highlight_type :string           not null
#  starting_index :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
FactoryBot.define do
  factory :evidence_highlight, class: 'Evidence::Highlight' do
    association :feedback, factory: :evidence_feedback
    text { "Highlight me" }
    highlight_type { "passage" }
    starting_index { 0 }
  end
end
