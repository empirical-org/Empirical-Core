# frozen_string_literal: true

require 'rails_helper'

describe TeacherInvitedAdminAnalyticsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:teacher) { create(:teacher) }
    let(:analyzer) { double(:analyzer) }
    let(:admin_name) { 'Admin Name' }
    let(:admin_email) { 'admin@email.com' }
    let(:note) { 'Please' }

    before { allow(SegmentAnalytics).to receive(:new) { analyzer } }

    it 'should track the event' do
      expect(analyzer).to receive(:track_teacher_invited_admin).with(teacher, admin_name, admin_email, note)
      subject.perform(teacher.id, admin_name, admin_email, note)
    end
  end
end
