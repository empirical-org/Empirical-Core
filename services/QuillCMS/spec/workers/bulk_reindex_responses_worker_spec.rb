require 'rails_helper'

describe BulkReindexResponsesWorker do
  let(:worker) { described_class.new }
  let!(:response) { create(:response, question_uid: 'blah', count: 1, first_attempt_count: 1) }
  let!(:response2) { create(:response, question_uid: 'blah', parent_id: response.id, count: 1, first_attempt_count: 1) }
  let!(:response3) { create(:response, question_uid: 'blah', parent_id: response.id, count: 1, first_attempt_count: 1) }
  let!(:response4) { create(:response, question_uid: 'blah', parent_id: response.id, count: 1, first_attempt_count: 1) }
  let!(:response5) { create(:response, question_uid: 'blah', parent_id: response.id, count: 1, first_attempt_count: 1) }

  describe '#perform' do
    it "should send a bulk payload to Elasticsearch" do
      client = double(Response.__elasticsearch__.client, bulk: nil)
      expected_payload = {
        index: "responses",
        type: "response",
        body: [
          {index: { _id: response.id, data: response.as_indexed_json}},
          {index: { _id: response2.id, data: response2.as_indexed_json}},
          {index: { _id: response3.id, data: response3.as_indexed_json}},
          {index: { _id: response4.id, data: response4.as_indexed_json}},
          {index: { _id: response5.id, data: response5.as_indexed_json}}
        ]
      }
      expect(Response.__elasticsearch__.client).to receive(:bulk).with(expected_payload)

      worker.perform(response.id, response5.id, 5)
    end

    it "should limit payload to start and end index" do
      client = double(Response.__elasticsearch__.client, bulk: nil)
      expected_payload = {
        index: "responses",
        type: "response",
        body: [
          {index: { _id: response2.id, data: response2.as_indexed_json}},
          {index: { _id: response3.id, data: response3.as_indexed_json}},
          {index: { _id: response4.id, data: response4.as_indexed_json}}
        ]
      }
      expect(Response.__elasticsearch__.client).to receive(:bulk).with(expected_payload)

      worker.perform(response2.id, response4.id, 5)
    end
  end

  describe '#cancel' do
    it 'should cancel the job and prevent the job from running' do
      job_id = 'JID'
      job_double = double
      sidekiq_double = double(find_job: job_double)
      expect(Sidekiq::ScheduledSet).to receive(:new).and_return(sidekiq_double)
      expect(sidekiq_double).to receive(:find_job).with(job_id)
      expect(job_double).to receive(:delete)
      BulkReindexResponsesWorker.cancel!(job_id)
    end
  end
end
