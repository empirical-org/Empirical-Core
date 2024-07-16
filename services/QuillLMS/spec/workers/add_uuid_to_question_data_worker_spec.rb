# frozen_string_literal: true

require 'rails_helper'

describe AddUuidToQuestionDataWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:question) { create(:question) }
    let(:type) { Question::INCORRECT_SEQUENCES }

    context 'questions without an array type' do
      it 'does not change the question' do
        expect(question).not_to receive(:save_uids_for)
        subject.perform(type, 0, 1)
      end

    end

    context 'question with an array type' do
      let(:data) { [{'text' => 'foo', 'feedback' => 'bar'}]}

      before do
        question.data[type] = data
        question.save(validate: false)
      end

      it 'saves the uids for the question' do
        subject.perform(type, 0, 1)
        uids = question.reload.data[type].map{|seq| seq['uid']}.compact
        expect(uids.length).to eq(1)
      end

      it 'does not update the cache' do
        expect_any_instance_of(Question).not_to receive(:refresh_caches)
        subject.perform(type, 0, 1)
      end
    end

  end
end
