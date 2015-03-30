require_relative './progress_report_page'

module Teachers
  class ClassroomsProgressReportPage < ProgressReportPage
    def path
      teachers_progress_reports_standards_classrooms_path
    end
  end
end