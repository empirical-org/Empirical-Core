require 'rails_helper'

describe BatchReindexResponsesWorker do
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

      worker.perform(response.id, response5.id)
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

      worker.perform(response2.id, response4.id)
    end
  end
end
