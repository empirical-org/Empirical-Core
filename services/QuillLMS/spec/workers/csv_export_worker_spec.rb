# frozen_string_literal: true

require 'rails_helper'

describe CsvExportWorker do
  subject { described_class.new }

  describe '#perform' do
    context 'when csv export is sent' do
      before do
        allow(CsvExport).to receive(:find) { double(sent?: true) }
      end

      it 'should return' do
        expect(subject.perform(1, 2)).to eq nil
      end
    end

    context 'when csv export is not sent' do
      let(:file) { double(:file, url: "url") }
      let(:export) { double(:export, sent?: false, export!: true, csv_file: file, mark_sent!: true) }

      before do
        allow(CsvExport).to receive(:find) { export }
      end

      it 'should export the csv, run pusher export completed service and mark the csv as sent' do
        expect(export).to receive(:export!)
        expect(export).to receive(:mark_sent!)
        expect(PusherCSVExportCompleted).to receive(:run).with(1, "url")
        subject.perform(2, 1)
      end

    end
  end

end
