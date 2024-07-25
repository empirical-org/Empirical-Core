# frozen_string_literal: true

# == Schema Information
#
# Table name: translation_mappings
#
#  id              :bigint           not null, primary key
#  field_name      :string           not null
#  source_type     :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  english_text_id :integer          not null
#  source_id       :integer          not null
#
require 'rails_helper'
RSpec.describe TranslationMapping, type: :model do
  describe 'active_record associations' do
    it { should belong_to(:english_text) }
    it { should belong_to(:source) }
    it { should have_many(:translated_texts) }
  end
end
