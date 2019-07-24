require_relative './progress_report_page'

module Teachers
  class StandardsForStudentProgressReportPage < ProgressReportPage
    def initialize(classroom, student)
      @classroom = classroom
      @student = student
    end

    def path
      teachers_progress_reports_standards_classroom_student_topics_path(
        classroom_id: @classroom.id,
        student_id: @student.id
      )
    end
  end
end