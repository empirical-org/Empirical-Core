# frozen_string_literal: true

# == Schema Information
#
# Table name: response_instructions
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_instructions_on_text  (text) UNIQUE
#
require 'rails_helper'

RSpec.describe ResponseInstructions, type: :model do
  before do
    create(:response_instructions)
  end

  context 'associations' do
    it { should have_many(:responses) }
  end

  context 'validations' do
    it { should validate_length_of(:text).is_at_least(1) }
    it { should validate_uniqueness_of(:text) }
  end
end
