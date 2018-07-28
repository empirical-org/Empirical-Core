require 'rails_helper'

describe ReportMilestoneToSegmentWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let(:analytics) { double(:analytics, identify: true, track: true) }
    let!(:user) { create(:user) }

    before do
      allow(SegmentAnalytics).to receive(:new) { analytics }
    end

    it 'should identify the user and track the event' do
      expect(analytics).to receive(:identify).with(user)
      expect(analytics).to receive(:track).with(
        user_id: user.id,
        event: SegmentIo::Events::USER_COMPLETED_MILESTONE,
        context: { ip: user.ip_address },
        properties: { milestone_name: "milestone" }
      )
      subject.perform(user.id, "milestone")
    end
  end
end