# frozen_string_literal: true

# == Schema Information
#
# Table name: english_texts
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe EnglishText, type: :model do
  describe 'active_record associations' do
    it {should have_many(:translated_texts) }
    it {should have_many(:translation_mappings) }
  end
end
