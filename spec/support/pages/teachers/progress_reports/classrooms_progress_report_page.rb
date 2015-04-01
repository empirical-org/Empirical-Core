require_relative './progress_report_page'

module Teachers
  class ClassroomsProgressReportPage < ProgressReportPage
    def path
      teachers_progress_reports_standards_classrooms_path
    end

    def click_standard_view(row_index)
      table.all('.standard-view')[row_index].click
    end

    def click_student_view(row_index)
      table.all('.student-view')[row_index].click
    end
  end
end