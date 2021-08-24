require 'rails_helper'

describe RefreshAllResponsesViewsWorker do
  let(:worker) { described_class.new }

  describe '#perform' do
    it "should run a refresh responsee view job for each view" do
      stub_const("RefreshResponsesViewWorker::REFRESH_TIMEOUT", '1min')

      expect(RefreshResponsesViewWorker).to receive(:perform_in).with(0, 'GradedResponse')
      expect(RefreshResponsesViewWorker).to receive(:perform_in).with(60, 'MultipleChoiceResponse')

      worker.perform
    end

    it "should spread out jobs by default if REFRESH_TIMEOUT is not in minutes" do
      stub_const("RefreshResponsesViewWorker::REFRESH_TIMEOUT", '999999999999999999s')

      expect(RefreshResponsesViewWorker).to receive(:perform_in).with(0, 'GradedResponse')
      expect(RefreshResponsesViewWorker).to receive(:perform_in).with(600, 'MultipleChoiceResponse')

      worker.perform
    end
  end
end
