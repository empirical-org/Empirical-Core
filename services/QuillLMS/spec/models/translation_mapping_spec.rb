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
require 'rails_helper'

RSpec.describe TranslationMapping, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
