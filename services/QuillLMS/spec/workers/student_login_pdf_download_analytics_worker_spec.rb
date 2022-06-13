# frozen_string_literal: true

require 'rails_helper'

describe StudentLoginPdfDownloadAnalyticsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let!(:classroom) { create(:classroom) }
    let(:analyzer) { double(:analyzer, track_student_login_pdf_download: true) }

    before do
      allow(SegmentAnalytics).to receive(:new) { analyzer }
    end

    it 'should track the student login pdf download' do
      expect(analyzer).to receive(:track_student_login_pdf_download).with(user.id, classroom.id)
      subject.perform(user.id, classroom.id)
    end
  end
end
