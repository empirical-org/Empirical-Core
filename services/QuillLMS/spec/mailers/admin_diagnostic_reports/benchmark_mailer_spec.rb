# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe BenchmarkMailer, type: :mailer do
    let(:email) { 'address@example.com' }
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

    it { expect(mail.subject).to eq('Admin Diagnostic Report Query Runtimes') }
    it { expect(mail.to).to eq([described_class::RECIPIENT_EMAIL]) }
    it { expect(mail.from).to eq(['hello@quill.org']) }
    it { expect(mail.body).to include(report_text) }
  end
end
