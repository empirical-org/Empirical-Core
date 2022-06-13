# frozen_string_literal: true

class Teachers::ProgressReports::Concepts::StudentsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html
      format.json { render json: json_payload }
    end
  end

  private def json_payload
    current_user.all_classrooms_cache(key: 'teachers.progress_reports.concepts.students') do
      {
        students: students_as_json,
        classrooms_with_student_ids: current_user.classrooms_i_teach_with_student_ids
      }
    end
  end

  private def students_as_json
    ::ProgressReports::Concepts::User.results(current_user, {}).map do |student|
      serializer = ::ProgressReports::Concepts::StudentSerializer.new(student)
      serializer.as_json(root: false)
    end
  end
end
