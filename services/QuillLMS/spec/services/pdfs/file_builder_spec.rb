# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  RSpec.describe FileBuilder do
    subject { described_class.run(data:, template:) }

    let(:application_controller) { double(render_to_string: pdf_string) }
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

    describe '#run' do
      it { expect(subject).to be_a Tempfile }
      it { expect(subject.read).to eq pdf_string }
    end
  end
end
