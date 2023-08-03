# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_feedbacks
#
#  id          :integer          not null, primary key
#  rule_id     :integer          not null
#  text        :string           not null
#  description :string
#  order       :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
FactoryBot.define do
  factory :evidence_feedback, class: 'Evidence::Feedback' do
    association :rule, factory: :evidence_rule
    text { "Here is some test feedback." }
    description { "Test description for test feedback record." }
    sequence(:order)
  end
end
