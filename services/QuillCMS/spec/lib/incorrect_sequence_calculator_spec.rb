require "rails_helper"
require 'modules/incorrect_sequence_calculator'

RSpec.describe IncorrectSequenceCalculator do
  describe '#incorrect_sequences_for_question' do
    it 'should foo' do
      question_uid = 1
      3.times { create(:response, question_uid: question_uid) }
      result = IncorrectSequenceCalculator.incorrect_sequences_for_question(question_uid)
      expect(result.length).to eq 18
    end
  end
end