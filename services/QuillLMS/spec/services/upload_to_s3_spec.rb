# frozen_string_literal: true

require 'rails_helper'

describe UploadToS3 do
  subject { described_class.run(user, payload) }

  let(:user) { create(:user) }
  let(:payload) { 'test payload' }
  let(:csv_tempfile) { Tempfile.new('mock.csv') }
  let(:mock_uploader) { double(store!: [], url: 'a_url') }

  describe '#run' do
    before do
      allow(Tempfile).to receive(:new).with(described_class::TEMPFILE_NAME).and_return(csv_tempfile)
      allow(AdminReportCsvUploader).to receive(:new).with(admin_id: user.id).and_return(mock_uploader)
    end

    it { expect { subject }.not_to raise_error }

    it do
      expect(csv_tempfile).to receive(:<<).with(payload)
      expect(mock_uploader).to receive(:store!).with(csv_tempfile)

      subject
    end

    context 'upload fails' do
      let(:mock_uploader) { double(store!: false) }

      it { expect { subject }.to raise_error(described_class::CloudUploadError) }
    end
  end
end
