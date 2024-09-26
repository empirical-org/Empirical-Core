# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_labeled_entries
#
#  id         :bigint           not null, primary key
#  embedding  :vector(1536)     not null
#  entry      :text             not null
#  label      :text             not null
#  metadata   :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  prompt_id  :integer          not null
#
# Indexes
#
#  index_evidence_labeled_entries_on_prompt_id  (prompt_id)
#

FactoryBot.define do
  factory :evidence_labeled_entry, class: 'Evidence::LabeledEntry' do
    entry { Faker::Lorem.sentence }
    embedding { Array.new(Evidence::LabeledEntry::DIMENSION) { rand(-1.0..1.0) } }
    label { "Label_#{rand(0..10)}" }

    association :prompt, factory: :evidence_prompt
  end
end
