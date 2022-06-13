require "rails_helper"
require 'modules/incorrect_sequence_calculator'

RSpec.describe IncorrectSequenceCalculator do
  describe '#incorrect_sequences_for_question' do
    it 'should foo' do
      question_uid = 1
      create(:response, question_uid: question_uid)
      create(:response, question_uid: question_uid)
      result = IncorrectSequenceCalculator.incorrect_sequences_for_question(question_uid)
      expect(result.length).to eq 14
    end
  end
end