# frozen_string_literal: true

require 'rails_helper'

describe AdminReceivedAdminUpgradeRequestFromTeacherAnalyticsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:admin) { create(:admin) }
    let!(:teacher) { create(:teacher) }
    let(:analyzer) { double(:analyzer) }
    let(:reason) { 'Please' }

    before { allow(SegmentAnalytics).to receive(:new) { analyzer } }

    it 'should track the event' do
      expect(analyzer).to receive(:track_admin_received_admin_upgrade_request_form_teacher).with(admin, teacher, reason)
      subject.perform(admin.id, teacher.id, reason)
    end
  end
end
