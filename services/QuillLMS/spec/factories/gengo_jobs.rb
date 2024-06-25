# frozen_string_literal: true

# == Schema Information
#
# Table name: gengo_jobs
#
#  id                 :bigint           not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  english_text_id    :integer          not null
#  translated_text_id :integer
#  translation_job_id :string           not null
#
FactoryBot.define do
  factory :gengo_job do
    english_text_id { 1 }
    translation_job_id { 23 }
    locale { Gengo::SPANISH_LOCALE }
  end
end
