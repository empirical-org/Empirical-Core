# frozen_string_literal: true

# == Schema Information
#
# Table name: response_question_types
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_question_types_on_text  (text) UNIQUE
#
require 'rails_helper'

RSpec.describe ResponseQuestionType, type: :model do
  before do
    create(:response_question_type)
  end

  context 'associations' do
    it { should have_many(:responses) }
  end

  context 'validations' do
    it { should validate_presence_of(:text) }
    it { should validate_uniqueness_of(:text) }
  end
end
