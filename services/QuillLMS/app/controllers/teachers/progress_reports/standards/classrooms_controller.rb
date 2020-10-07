class Teachers::ProgressReports::Standards::ClassroomsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html do
        AccessProgressReportWorker.perform_async(current_user.id)
      end

      format.json do
        classroom_id = params[:classroom_id]
        student_id = nil
        data = ::ProgressReports::Standards::AllClassroomsStandard.new(current_user).results(classroom_id, student_id)
        render json: {
          data: data,
          teacher: UserWithEmailSerializer.new(current_user).as_json(root: false),
          classrooms: current_user.classrooms_i_teach,
          students: student_names_and_ids(classroom_id)
        }
      end
    end
  end
end

private

def student_names_and_ids(classroom_id)
  if classroom_id
    classroom_conditional = "AND classrooms.id = #{classroom_id}"
  end
    ActiveRecord::Base.connection.execute("SELECT DISTINCT students.name, students.id, substring(students.name, '([^[:space:]]+)(?:,|$)') AS last_name FROM users AS teacher
    JOIN classrooms_teachers AS ct ON ct.user_id = teacher.id
    JOIN classrooms ON classrooms.id = ct.classroom_id AND classrooms.visible = TRUE
    JOIN students_classrooms AS sc ON sc.classroom_id = ct.classroom_id
    JOIN users AS students ON students.id = sc.student_id
    WHERE teacher.id = #{current_user.id}
    #{classroom_conditional}
    ORDER BY substring(students.name, '([^[:space:]]+)(?:,|$)')").to_a
end
