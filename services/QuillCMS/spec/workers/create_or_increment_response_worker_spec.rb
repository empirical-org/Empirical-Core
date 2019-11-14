require 'rails_helper'

describe CreateOrIncrementResponseWorker do
  let(:subject) { described_class.new }

  before do
    allow(AdminUpdates).to receive(:run).and_return(nil)
  end

  let!(:parent_response) { create(:response, child_count: 1 )}
  let!(:response) { create(:response, question_uid: 'blah', parent_id: parent_response.id, count: 1, first_attempt_count: 1) }

  describe '#perform' do
    context 'if the response already exists' do
      it 'should increment the count of the response' do
        subject.perform({ text: response.text, question_uid: response.question_uid })
        expect(response.reload.count).to eq(2)
      end

      it 'should increment the child count of the parent response if there is a parent id' do
        subject.perform({ text: response.text, question_uid: response.question_uid })
        expect(parent_response.reload.child_count).to eq(2)
      end

      it 'should increment the first attempt count if it was sent that set to true' do
        subject.perform({ text: response.text, question_uid: response.question_uid, is_first_attempt: 'true' })
        expect(response.reload.first_attempt_count).to eq(2)
      end

      it 'should not increment the first attempt count if it was not set to true' do
        subject.perform({ text: response.text, question_uid: response.question_uid })
        expect(response.reload.first_attempt_count).to eq(1)
      end
    end

    context 'if the response does not already exist' do
      it 'should create a new response' do
        text = 'Totally different text'
        subject.perform({ text: text })
        expect(Response.find_by(text: 'Totally different text').id).to be
      end
    end
  end

end
