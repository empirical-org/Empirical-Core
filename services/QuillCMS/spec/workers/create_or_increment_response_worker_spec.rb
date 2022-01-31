require 'rails_helper'

describe CreateOrIncrementResponseWorker do
  subject { described_class.new }

  before do
    allow(AdminUpdates).to receive(:run).and_return(nil)
  end

  let!(:parent_response) { create(:response, child_count: 1 )}
  let!(:response) { create(:response, question_uid: 'blah', parent_id: parent_response.id, count: 1, first_attempt_count: 1) }

  describe '#perform' do
    context 'if the response already exists' do
      it 'should increment the count of the response and set updated at timestamp' do
        original_count = response.count
        original_updated_at = response.updated_at
        subject.perform({ text: response.text, question_uid: response.question_uid })
        expect(response.reload.count).to eq(original_count + 1)
        expect(response.reload.updated_at).to be > original_updated_at
      end

      it 'should increment the child count of the parent response if there is a parent id' do
        original_count = parent_response.child_count
        subject.perform({ text: response.text, question_uid: response.question_uid })
        expect(parent_response.reload.child_count).to eq(original_count + 1)
      end

      it 'should increment the first attempt count if it was sent that set to true' do
        original_count = response.first_attempt_count
        subject.perform({ text: response.text, question_uid: response.question_uid, is_first_attempt: 'true' })
        expect(response.reload.first_attempt_count).to eq(original_count + 1)
      end

      it 'should not increment the first attempt count if it was not set to true' do
        original_count = response.first_attempt_count
        subject.perform({ text: response.text, question_uid: response.question_uid })
        expect(response.reload.first_attempt_count).to eq(original_count)
      end
    end

    context 'if the response does not already exist' do
      it 'should create a new response' do
        text = 'Totally different text'
        subject.perform({ text: text })
        expect(Response.find_by(text: 'Totally different text').id).to be
      end

      it 'should persist a response even if elasticsearch indexing fails' do
        text = 'Totally different text'
        exception = Elasticsearch::Transport::Transport::Errors::BadRequest
        expect_any_instance_of(Response).to receive(:create_index_in_elastic_search).and_raise(exception)

        subject.perform({ text: text })
        expect(Response.find_by(text: 'Totally different text').id).to be
      end
    end

    it 'should exctract the right params from the hash if it is keyed with strings' do
      input = {
        'text' => 'foo',
        'question_uid' => 'bar',
      }
      expect(Response).to receive(:find_by).with(text: 'foo', question_uid: 'bar')
      subject.perform(input)
    end

    it 'should exctract the right params from the hash if it is keyed with symbols' do
      input = {
        :text => 'foo',
        :question_uid => 'bar',
      }
      expect(Response).to receive(:find_by).with(text: 'foo', question_uid: 'bar')
      subject.perform(input)
    end
  end

end
