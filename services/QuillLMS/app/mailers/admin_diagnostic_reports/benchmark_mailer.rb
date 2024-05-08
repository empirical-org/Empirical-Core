# frozen_string_literal: true

module AdminDiagnosticReports
  class BenchmarkMailer < ::ApplicationMailer
    default from: 'hello@quill.org'

    RECIPIENT_EMAIL = ENV['SLACK_ADGR_PERFORMANCE_BENCHMARKS_EMAIL']

    def benchmark_report(data)
      @data = data
      mail to: RECIPIENT_EMAIL, subject: 'Admin Diagnostic Report Query Runtimes'
    end
  end
end
