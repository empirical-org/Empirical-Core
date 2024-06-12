# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::SyncOrchestratorWorker do
  subject { described_class.new.perform }

  describe '#perform' do
    it 'should call SyncOrchestrator' do
      expect(LearnWorldsIntegration::SyncOrchestrator).to receive(:run).once
      subject
    end
  end
end
