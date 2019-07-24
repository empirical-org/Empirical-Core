require_relative './progress_report_page'

module Teachers
  class StudentsForStandardProgressReportPage < ProgressReportPage
    def initialize(classroom, topic)
      @classroom = classroom
      @topic = topic
    end

    def path
      teachers_progress_reports_standards_classroom_topic_students_path(
        classroom_id: @classroom.id,
        topic_id: @topic.id
      )
    end
  end
end