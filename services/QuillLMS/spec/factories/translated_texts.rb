# frozen_string_literal: true

# == Schema Information
#
# Table name: translated_texts
#
#  id              :bigint           not null, primary key
#  locale          :string           not null
#  source_api      :string
#  translation     :text             not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  english_text_id :integer          not null
#
FactoryBot.define do
  factory :translated_text do
    locale { Translatable::DEFAULT_LOCALE }
    english_text
    source_api { Translatable::OPEN_AI_SOURCE }
    translation { Faker::Quotes::Shakespeare.as_you_like_it_quote }

    factory :gengo_translated_text, class: 'TranslatedText' do
      source_api { Translatable::GENGO_SOURCE }
    end
  end

end
