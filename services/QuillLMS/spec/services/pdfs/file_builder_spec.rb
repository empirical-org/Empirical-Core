# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  RSpec.describe FileBuilder do
    let(:application_controller) { double(:application_controller) }
    let(:data) { 'data' }
    let(:layout) { 'pdf' }
    let(:locals) { { data: data } }
    let(:pdf_string) { 'PDF content' }
    let(:template) { 'pdf' }

    before do
      allow(ApplicationController)
        .to receive(:new)
        .and_return(application_controller)

      allow(application_controller)
        .to receive(:render_to_string)
        .with(layout:, locals:, template:)
        .and_return(pdf_string)

      allow(Grover)
        .to receive(:new)
        .and_return(double(to_pdf: pdf_string))
    end

    it 'yields the tempfile to the block' do
      described_class.run(data:, template:) do |tempfile|
        expect(tempfile).to be_a Tempfile
        expect(tempfile.read).to eq pdf_string
      end
    end

    it 'ensures tempfile is closed and unlinked after the block' do
      tempfile_path = nil

      described_class.run(data:, template:) do |tempfile|
        tempfile_path = tempfile.path
        expect(tempfile).to be_a Tempfile
        expect(File.exist?(tempfile_path)).to be true
      end

      expect(File.exist?(tempfile_path)).to be false
    end
  end
end
