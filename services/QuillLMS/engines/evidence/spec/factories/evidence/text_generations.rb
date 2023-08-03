# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_text_generations
#
#  id         :bigint           not null, primary key
#  type       :string           not null
#  config     :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :evidence_text_generation, class: 'Evidence::TextGeneration' do
    type { Evidence::TextGeneration::TYPE_ORIGINAL }
  end
end
