# frozen_string_literal: true

# == Schema Information
#
# Table name: student_response_answer_texts
#
#  id         :bigint           not null, primary key
#  text       :jsonb            not null
#  created_at :datetime         not null
#
require 'rails_helper'

RSpec.describe StudentResponseAnswerText, type: :model do
  before do
    create(:student_response_answer_text)
  end

  context 'associations' do
    it { should have_many(:student_responses) }
  end

  context 'validations' do
    it { should validate_length_of(:text).is_at_least(0) }
    it { should validate_uniqueness_of(:text) }
  end

  context 'answer data shape' do
    it 'should handle raw strings cleanly' do
      data = 'this is a test string'
      model = create(:student_response_answer_text, text: data)
      expect(model.valid?).to be(true)
      expect(model.text).to eq(data)
    end

    it 'should handle arrays cleanly' do
      data = [1,2,3]
      model = create(:student_response_answer_text, text: data)
      expect(model.valid?).to be(true)
      expect(model.text).to eq(data)
    end

    it 'should handle hashes cleanly' do
      data = {'foo' => 'bar'}
      model = create(:student_response_answer_text, text: data)
      expect(model.valid?).to be(true)
      expect(model.text).to eq(data)
    end
  end
end
