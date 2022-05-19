# frozen_string_literal: true

class Teachers::ProgressReports::Standards::StandardStudentsController < Teachers::ProgressReportsController
  def index
    classroom_id = params[:classroom_id].to_i
    respond_to do |format|
      format.html
      format.json do
        cache_groups = {
          classroom_id: params["classroom_id"],
          standard_id: params["standard_id"]
        }
        response = current_user.all_classrooms_cache(key: 'teachers.progress_reports.standards_standard_students.index', groups: cache_groups) do
          students = ::ProgressReports::Standards::NewStudent.new(current_user).results(params)
          students_json = students.map do |student|
            serializer = ::ProgressReports::Standards::StudentSerializer.new(student)
            # Doing this because can't figure out how to get custom params into serializers
            serializer.classroom_id = classroom_id
            serializer.as_json(root: false)
          end
          standards = ::ProgressReports::Standards::NewStandard.new(current_user).results(params)
          standards_json = standards.map do |standard|
            serializer = ::ProgressReports::Standards::StandardSerializer.new(standard)
            # Doing this because can't figure out how to get custom params into serializers
            serializer.classroom_id = classroom_id
            serializer.as_json(root: false)
          end
          classrooms_i_teach = current_user.classrooms_i_teach
          selected_classroom = classroom_id == 0 ? 'All Classrooms' : classrooms_i_teach.find{|c| c.id == classroom_id}
          {
            selected_classroom: selected_classroom,
            classrooms: classrooms_i_teach,
            students: students_json,
            standards: standards_json,
            units: ProgressReports::Standards::Unit.new(current_user).results({}),
            teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
          }
        end
        render json: response
      end
    end
  end
end
