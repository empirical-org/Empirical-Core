# == Schema Information
#
# Table name: openai_translated_texts
#
#  id              :bigint           not null, primary key
#  locale          :string           not null
#  translation     :text             not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  english_text_id :integer          not null
#
FactoryBot.define do
  factory :openai_translated_text do
    
  end
end
