# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_regex_rules
#
#  id             :integer          not null, primary key
#  regex_text     :string(200)      not null
#  case_sensitive :boolean          not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  rule_id        :integer
#  sequence_type  :text             default("incorrect"), not null
#  conditional    :boolean          default(FALSE)
#
FactoryBot.define do
  factory :evidence_regex_rule, class: 'Evidence::RegexRule' do
    association :rule, factory: :evidence_rule
    regex_text { "MyString" }
    case_sensitive { false }
    sequence_type { "incorrect" }
  end
end
