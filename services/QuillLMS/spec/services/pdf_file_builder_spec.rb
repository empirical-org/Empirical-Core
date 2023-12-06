# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PdfFileBuilder do
  subject { described_class.run(data, template) }

  let(:data) { { some_key: 'some_value' } }
  let(:template) { 'pdf' }
  let(:pdf_string) { 'PDF content' }

  describe '#run' do
    it { expect(subject).to be_a Tempfile }
    it { expect(subject.read).to eq pdf_string }
  end
end
