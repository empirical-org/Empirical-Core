# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe BenchmarkMailer, type: :mailer do
    let(:email) { 'address@example.com' }
    let(:recipient_email) { 'recipient@example.com' }
    let(:query_name) { 'sample_query' }
    let(:elapsed_time) { 1.1 }
    let(:report_text) { "#{query_name} - #{elapsed_time} seconds" }
    let(:data) do
      {
        email => {
          query_name => elapsed_time
        }
      }
    end
    let(:mail) { described_class.benchmark_report(data) }

    before do
      allow_any_instance_of(ActionView::Base).to receive(:vite_stylesheet_tag)
      stub_const('AdminDiagnosticReports::BenchmarkMailer::RECIPIENT_EMAIL', recipient_email)
    end

    it { expect(mail.subject).to eq('Admin Diagnostic Report Query Runtimes') }
    it { expect(mail.to).to eq([recipient_email]) }
    it { expect(mail.from).to eq(['hello@quill.org']) }
    it { expect(mail.body).to include(report_text) }
  end
end
