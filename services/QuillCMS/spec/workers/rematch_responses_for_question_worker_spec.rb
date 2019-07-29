require 'rails_helper'

describe RematchResponsesForQuestionWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    question_uid = 'FAKE_UID'
    question_type = 'FAKE_TYPE'
    let(:response1) { create(:response) }
    let(:response2) { create(:response, id: 2) }
    it 'should load rematch-eligible responses and enqueue them' do
      expect(subject).to receive(:get_ungraded_responses).with(question_uid).and_return([response1])
      expect(subject).to receive(:get_machine_graded_responses).with(question_uid).and_return([response2])
      expect(RematchResponseWorker).to receive(:perform_async).with(response1.id, question_type, question_uid).ordered
      expect(RematchResponseWorker).to receive(:perform_async).with(response2.id, question_type, question_uid).ordered
      subject.perform(question_uid, question_type)
    end
  end
end

