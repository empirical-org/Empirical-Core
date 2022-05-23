# frozen_string_literal: true

# == Schema Information
#
# Table name: response_answer_texts
#
#  id         :bigint           not null, primary key
#  text       :jsonb            not null
#  created_at :datetime         not null
#
require 'rails_helper'

RSpec.describe ResponseAnswer, type: :model do
  before do
    create(:response_answer)
  end

  context 'associations' do
    it { should have_many(:responses) }
  end

  context 'validations' do
    it { should validate_length_of(:json).is_at_least(0) }
    it { should validate_uniqueness_of(:json) }
  end

  context 'answer data shape' do
    it 'should handle raw strings cleanly' do
      data = 'this is a test string'
      model = create(:response_answer, json: data)
      expect(model.valid?).to be(true)
      expect(model.json).to eq(data)
    end

    it 'should handle arrays cleanly' do
      data = [1,2,3]
      model = create(:response_answer, json: data)
      expect(model.valid?).to be(true)
      expect(model.json).to eq(data)
    end

    it 'should handle hashes cleanly' do
      data = {'foo' => 'bar'}
      model = create(:response_answer, json: data)
      expect(model.valid?).to be(true)
      expect(model.json).to eq(data)
    end
  end
end
