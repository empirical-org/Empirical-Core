# frozen_string_literal: true

# == Schema Information
#
# Table name: translated_texts
#
#  id                 :bigint           not null, primary key
#  locale             :string           not null
#  translation        :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  english_text_id    :integer          not null
#  translation_job_id :string           not null
#
FactoryBot.define do
  factory :translated_text do
    locale { "es-la" }
    english_text_id { 1 }
    translation_job_id { 33 }
  end
end
