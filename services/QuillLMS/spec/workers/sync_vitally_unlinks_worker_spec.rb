# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyUnlinksWorker do
  subject { described_class.new }

  let(:school) { create(:school) }
  let(:user) { create(:teacher, school: school) }
  let(:vitally_analytics_api_double) { double }
  let(:now) { DateTime.current }

  before do
    allow(VitallyIntegration::AnalyticsApi).to receive(:new).and_return(vitally_analytics_api_double)
    allow(DateTime).to receive(:current).and_return(now)
  end

  describe '#perform' do
    it 'constructs an Unlink API payload and passes it to the vitally API' do
      expect(vitally_analytics_api_double).to receive(:unlink).with({
        userId: user.id,
        accountId: school.id,
        timestamp: now
      })

      subject.perform(user.id, school.id)
    end
  end
end
