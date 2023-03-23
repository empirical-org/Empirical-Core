# frozen_string_literal: true

require 'rails_helper'

describe AdminReceivedAdminUpgradeRequestFromTeacherAnalyticsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:admin) { create(:admin) }
    let!(:teacher) { create(:teacher) }
    let(:analyzer) { double(:analyzer) }
    let(:reason) { 'Please' }
    let(:new_user) { [true, false].sample }

    before { allow(SegmentAnalytics).to receive(:new) { analyzer } }

    it 'should track the event' do
      expect(analyzer).to receive(:track_admin_received_admin_upgrade_request_from_teacher).with(admin, teacher, reason, new_user)
      subject.perform(admin.id, teacher.id, reason, new_user)
    end
  end
end
