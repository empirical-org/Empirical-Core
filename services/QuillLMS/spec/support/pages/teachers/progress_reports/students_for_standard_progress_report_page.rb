require_relative './progress_report_page'

module Teachers
  class StudentsForStandardProgressReportPage < ProgressReportPage
    def initialize(classroom, standard)
      @classroom = classroom
      @standard = standard
    end

    def path
      teachers_progress_reports_standards_classroom_standard_students_path(
        classroom_id: @classroom.id,
        standard_id: @standard.id
      )
    end
  end
end
