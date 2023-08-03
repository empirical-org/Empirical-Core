# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_labels
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  rule_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :evidence_label do
    name { "some label name" }
    association :rule, factory: :evidence_rule
  end
end
