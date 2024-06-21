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
require 'rails_helper'

RSpec.describe OpenaiTranslatedText, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
