require_relative './progress_report_page'

module Teachers
  class ActivityProgressReportPage < ProgressReportPage
    def path
      teachers_progress_reports_activity_sessions_path
    end
  end
end
