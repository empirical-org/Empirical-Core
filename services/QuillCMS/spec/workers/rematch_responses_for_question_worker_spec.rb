require 'rails_helper'

describe RematchResponsesForQuestionWorker do
  subject { described_class.new }

  describe '#perform' do
    question_uid = 'FAKE_UID'
    question_type = 'FAKE_TYPE'
    question_hash = {'some_key': 'some value', 'key': question_uid}.stringify_keys

    let!(:graded_response) { create(:response, question_uid: question_uid, optimal: true) }
    let!(:graded_response2) { create(:response, question_uid: question_uid, optimal: false) }
    let(:ungraded_response) { create(:response, question_uid: question_uid, optimal: nil) }
    let(:machine_response) { create(:response, question_uid: question_uid, optimal: nil, parent_id: graded_response.id) }

    it 'should load rematch-eligible responses and enqueue them' do
      expect(subject).to receive(:retrieve_question).with(question_uid).and_return(question_hash)
      expect(RematchResponseWorker).to receive(:perform_async).with(ungraded_response.id, question_type, question_hash, [graded_response.id, graded_response2.id], fire_pusher_alert: false, question_uid: question_uid).once
      expect(RematchResponseWorker).to receive(:perform_async).with(machine_response.id, question_type, question_hash, [graded_response.id, graded_response2.id], fire_pusher_alert: true, question_uid: question_uid).once

      subject.perform(question_uid, question_type)
    end
  end
end
