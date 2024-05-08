# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe PerformanceBenchmarkWorker, type: :worker do
    subject { described_class.new }

    let(:mailer_double) { double }
    let(:payload) { { 'email@example.com' => { 'query' => 1.1 } } }

    it do
      expect(subject).to receive(:query_performance_by_email).and_return(payload)
      expect(BenchmarkMailer).to receive(:benchmark_report).with(payload).and_return(mailer_double)
      expect(mailer_double).to receive(:deliver_now!)

      subject.perform
    end
  end
end
