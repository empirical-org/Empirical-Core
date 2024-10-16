# frozen_string_literal: true

module AdminDiagnosticReports
  class ReportMailer < ::UserMailer
    attr_reader :user

    def csv_download_email(user_id, overview_url, skills_url, students_url)
      @user = User.find(user_id)
      @addressee_name = user.first_name
      @overview_url = overview_url
      @skills_url = skills_url
      @students_url = students_url
      @human_date = DateTime.current.strftime('%B %d, %Y')

      mail to:, subject:
    end

    private def to = ENV.fetch('TEST_EMAIL_ADDRESS', user.email)
    private def subject = 'Your Quill Diagnostic Growth Report is ready'
  end
end
