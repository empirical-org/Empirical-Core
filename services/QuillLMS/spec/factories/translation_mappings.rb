# frozen_string_literal: true

# == Schema Information
#
# Table name: translation_mappings
#
#  id              :bigint           not null, primary key
#  field_name      :string           not null
#  source_type     :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  english_text_id :integer          not null
#  source_id       :integer          not null
#
FactoryBot.define do
  factory :translation_mapping do
    source { create(:concept_feedback) }
    english_text { create(:english_text) }
    field_name { 'description' }
  end
end
