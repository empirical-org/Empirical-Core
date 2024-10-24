# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_labeled_entries
#
#  id                :bigint           not null, primary key
#  approved          :boolean
#  embedding         :vector(1536)     not null
#  entry             :text             not null
#  label             :text             not null
#  label_transformed :text             not null
#  metadata          :jsonb
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  prompt_id         :integer          not null
#
# Indexes
#
#  idx_on_prompt_id_entry_label_e61aa4cb93      (prompt_id,entry,label) UNIQUE
#  index_evidence_labeled_entries_on_prompt_id  (prompt_id)
#

FactoryBot.define do
  factory :evidence_labeled_entry, class: 'Evidence::LabeledEntry' do
    entry { Faker::Lorem.sentence }
    embedding { Array.new(Evidence::LabeledEntry::DIMENSION) { rand(-1.0..1.0) } }
    label { "Label_#{rand(0..10)}" }
    label_transformed { label }

    association :prompt, factory: :evidence_prompt
  end
end
