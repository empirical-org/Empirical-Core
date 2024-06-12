# == Schema Information
#
# Table name: translated_texts
#
#  id                 :bigint           not null, primary key
#  locale             :string           not null
#  translation        :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  english_text_id    :integer
#  translation_job_id :string           not null
#
require 'rails_helper'

RSpec.describe TranslatedText, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
