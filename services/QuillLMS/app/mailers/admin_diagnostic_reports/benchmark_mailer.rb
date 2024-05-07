# frozen_string_literal: true

module AdminDiagnosticReports
  class BenchmarkMailer < ActionMailer::Base
    default from: 'hello@quill.org'
  
    RECIPIENT_EMAIL = 'thomas@quill.org'

    def benchmark_report(data)
      @data = data
      mail to: RECIPIENT_EMAIL, subject: 'Admin Diagnostic Report Query Runtimes'
    end
  end
end
