# == Schema Information
#
# Table name: english_texts
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :english_text do
    text { Faker::Quotes::Shakespeare.romeo_and_juliet_quote }

  end
end
