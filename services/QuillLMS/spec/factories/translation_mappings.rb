# == Schema Information
#
# Table name: translation_mappings
#
#  id              :bigint           not null, primary key
#  source_key      :string
#  source_type     :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  english_text_id :integer          not null
#  source_id       :integer          not null
#
FactoryBot.define do
  factory :translation_mapping do
    
  end
end
