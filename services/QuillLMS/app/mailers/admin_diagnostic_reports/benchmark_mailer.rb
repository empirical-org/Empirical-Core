# frozen_string_literal: true

module AdminDiagnosticReports
  class BenchmarkMailer < ::ApplicationMailer
    default from: 'hello@quill.org'

    RECIPIENT_EMAIL = 'adgr-performance-benc-aaaam4wgvisxjpenaqvnndhgvy@quill.slack.com'

    def benchmark_report(data)
      @data = data
      mail to: RECIPIENT_EMAIL, subject: 'Admin Diagnostic Report Query Runtimes'
    end
  end
end
