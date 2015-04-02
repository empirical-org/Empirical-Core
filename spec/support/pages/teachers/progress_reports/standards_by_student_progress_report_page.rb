require_relative './progress_report_page'

module Teachers
  class StandardsByStudentProgressReportPage < ProgressReportPage
    def initialize(classroom)
      @classroom = classroom
    end

    def path
      teachers_progress_reports_standards_classroom_students_path(@classroom.id)
    end

    def click_student_view(row_index)
      table.all('.student-view')[row_index].click
    end
  end
end