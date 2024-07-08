# frozen_string_literal: true

# == Schema Information
#
# Table name: gengo_jobs
#
#  id                 :bigint           not null, primary key
#  locale             :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  english_text_id    :integer          not null
#  translated_text_id :integer
#  translation_job_id :string           not null
#
FactoryBot.define do
  factory :gengo_job do
    english_text
    translation_job_id { 23 }
    locale { Translatable::DEFAULT_LOCALE }
  end
end
