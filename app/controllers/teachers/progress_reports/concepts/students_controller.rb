class Teachers::ProgressReports::Concepts::StudentsController < Teachers::ProgressReportsController
  def index

    if current_user.classrooms_i_teach.empty?
      redirect_to new_teachers_classroom_path
      return
    end
    respond_to do |format|
      format.html
      format.json { render json: json_payload }
    end
  end

  private

  def json_payload
    {
      students: students_as_json,
      classrooms_with_student_ids: current_user.classrooms_i_teach_with_student_ids
    }
  end

  def students_as_json
    ::ProgressReports::Concepts::User.results(current_user, {}).map do |student|
      serializer = ::ProgressReports::Concepts::StudentSerializer.new(student)
      serializer.as_json(root: false)
    end
  end
end
