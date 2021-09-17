require 'rails_helper'

describe BulkReindexResponsesWorker do
  let(:worker) { described_class.new }
  let!(:response) { create(:response, question_uid: 'blah', count: 1, first_attempt_count: 1) }
  let!(:response2) { create(:response, question_uid: 'blah', parent_id: response.id, count: 1, first_attempt_count: 1) }
  let!(:response3) { create(:response, question_uid: 'blah', parent_id: response.id, count: 1, first_attempt_count: 1) }
  let!(:response4) { create(:response, question_uid: 'blah', parent_id: response.id, count: 1, first_attempt_count: 1) }
  let!(:response5) { create(:response, question_uid: 'blah', parent_id: response.id, count: 1, first_attempt_count: 1) }

  describe '#perform' do
    it 'should fire batch reindex responses worker' do
      expect(BatchReindexResponsesWorker).to receive(:perform_async).with(response.id, response5.id)
      worker.perform(response.id, response5.id, 5)
    end

    it 'should fire multiple instances of batch reindex responses worker if batch size is less than response count' do
      expect(BatchReindexResponsesWorker).to receive(:perform_async).with(response.id, response2.id)
      expect(BatchReindexResponsesWorker).to receive(:perform_async).with(response3.id, response4.id)
      worker.perform(response.id, response4.id, 2)
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
