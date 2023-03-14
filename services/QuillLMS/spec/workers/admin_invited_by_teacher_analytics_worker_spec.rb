# frozen_string_literal: true

require 'rails_helper'

describe AdminInvitedByTeacherAnalyticsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:teacher) { create(:teacher) }
    let(:analyzer) { double(:analyzer) }
    let(:admin_name) { 'Admin Name' }
    let(:admin_email) { 'admin@email.com' }
    let(:note) { 'Please' }

    before { allow(SegmentAnalytics).to receive(:new) { analyzer } }

    it 'should track the event' do
      expect(analyzer).to receive(:track_admin_invited_by_teacher).with(admin_name, admin_email, teacher, note)
      subject.perform(admin_name, admin_email, teacher.id, note)
    end
  end
end
