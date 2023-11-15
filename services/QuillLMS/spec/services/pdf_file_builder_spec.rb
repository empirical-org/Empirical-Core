# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PdfFileBuilder do
  subject { described_class.run(data, template) }

  let(:data) { { some_key: 'some_value' } }
  let(:template) { 'pdf' }
  let(:pdf_file_builder) { described_class.new(data, template) }
  let(:pdf_string) { 'PDF content' }

  before do
    allow(WickedPdf)
      .to receive(:new)
      .and_return(double(pdf_from_string: pdf_string))
  end

  describe '#run' do
    it { expect(subject).to be_a Tempfile }
    it { expect(subject.read).to eq pdf_string }
  end
end
