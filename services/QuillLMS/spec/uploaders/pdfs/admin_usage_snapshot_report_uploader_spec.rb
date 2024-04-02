# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  RSpec.describe AdminUsageSnapshotReportUploader do
    let(:user_id) { 123 }
    let(:uploader) { described_class.new(user_id:) }

    it { expect(uploader.fog_attributes).to eq('Content-Type' => 'application/pdf') }
    it { expect(uploader.fog_public).to be false }

    describe '#filename' do
      let(:date) { Date.current.strftime('%m-%d-%y') }
      let(:filename) { "#{described_class::FILENAME_PREFIX}_#{user_id}_#{date}_#{token}.pdf" }
      let(:token) { 'abc---123' }

      before do
        allow(uploader).to receive(:date).and_return(date)
        allow(uploader).to receive(:generate_token).and_return(token)
      end

      it { expect(uploader.filename).to eq filename }
    end

    describe '#token_seed' do
      let(:utc_string) { '2023-01-01 00:00:00 UTC' }
      let(:token_seed) { "#{utc_string}--#{user_id}" }

      before { allow(Time).to receive(:current).and_return(Time.zone.parse(utc_string)) }

      it { expect(uploader.send(:token_seed)).to eq token_seed }
    end
  end
end
